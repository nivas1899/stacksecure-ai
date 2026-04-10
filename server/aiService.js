import path from 'path';

class AIService {
  constructor() {
    this.keys = [
      process.env.HF_KEY_1,
      process.env.HF_KEY_2,
      process.env.HF_KEY_3
    ].filter(Boolean);
    
    this.currentKeyIndex = 0;
    this.model = 'mistralai/Mistral-7B-Instruct-v0.2';
    this.cache = new Map();
  }

  getNextKey() {
    if (this.keys.length === 0) return null;
    const key = this.keys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    return key;
  }

  async generateBugBountyTips(attackType, vulnerabilitySummary) {
    const cacheKey = `${attackType}:${vulnerabilitySummary}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const prompt = `[INST] You are an elite Bug Bounty Hunter and Security Researcher. 
Provide a HIGHLY SPECIFIC 'Hunter's Tip' for reproducing the following vulnerability.
CRITICAL: Do not give generic advice like "check CVEs" or "update software". Provide actual testing strategies, payloads, or specific sinks to look for.

Attack Category: ${attackType}
Vulnerability Description: ${vulnerabilitySummary}

Format your response as a JSON object:
{
  "reproTip": "detailed strategy for identification and reproduction",
  "recommendation": "specific defensive fix"
}
[/INST]`;

    let attempts = 0;
    while (attempts < this.keys.length || attempts === 0) {
      const key = this.getNextKey();
      if (!key) {
        return this.getFallbackTips(attackType);
      }

      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 500, return_full_text: false }
          }),
        });

        if (response.status === 429) {
          console.warn(`HF Key ${this.currentKeyIndex} rate limited, rolling over...`);
          attempts++;
          continue;
        }

        if (!response.ok) {
          throw new Error(`HF API error: ${response.statusText}`);
        }

        const result = await response.json();
        const text = result[0]?.generated_text || '';
        
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
          
          if (parsed && parsed.reproTip && !parsed.reproTip.toLowerCase().includes('check for similar past cves')) {
            this.cache.set(cacheKey, parsed);
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse AI response as JSON', e);
        }

        const fallback = this.getFallbackTips(attackType);
        this.cache.set(cacheKey, fallback);
        return fallback;

      } catch (error) {
        console.error(`AI Service attempt ${attempts + 1} failed:`, error.message);
        attempts++;
      }
    }

    return this.getFallbackTips(attackType);
  }

  async generateEducationalVulnerabilities(techName, version) {
    const cacheKey = `edu:${techName}:${version}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const prompt = `[INST] You are a Security Researcher. Generate 3-5 high-likelihood security vulnerabilities for the following technology for educational purposes. 
Technology: ${techName}
Version: ${version}

Format your response as a JSON array of objects:
[
  {
    "id": "EDU-GEN-01",
    "summary": "Specific name of the vulnerability/risk",
    "severity": "CRITICAL, HIGH, MEDIUM, or LOW"
  }
]
Only return the JSON array.
[/INST]`;

    let attempts = 0;
    while (attempts < this.keys.length || attempts === 0) {
      const key = this.getNextKey();
      if (!key) break;

      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 500, return_full_text: false }
          }),
        });

        if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);

        const result = await response.json();
        const text = result[0]?.generated_text || '';
        
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        if (parsed.length > 0) {
          this.cache.set(cacheKey, parsed);
          return parsed;
        }
      } catch (error) {
        attempts++;
      }
    }

    // Static fallback if AI fails
    return [
      { id: 'EDU-STATIC-01', summary: `${techName} Potential Security Misconfiguration`, severity: 'MEDIUM' },
      { id: 'EDU-STATIC-02', summary: `${techName} Dependency Chain Vulnerability`, severity: 'HIGH' }
    ];
  }

  async detectTechnologiesFromSource(html, headersJson) {
    const prompt = `[INST] You are an advanced Wappalyzer-grade Web Architecture Expert. Your goal is to identify ALL technologies, scripts, frameworks, CDNs, and libraries used by this site from the HTML and Headers.

DO NOT restrict yourself to a predefined list. Discover everything you can observe, covering categories like "Analytics", "Advertising", "JavaScript libraries", "Security", "Font scripts", "PaaS", "Web frameworks", "Miscellaneous", "Load balancers", "Performance".

HTML Snippet:
${html}

Headers:
${headersJson}

Return ONLY a valid JSON array of objects. Format:
[
  { "id": "tech_slug", "name": "Display Name", "category": "Analytics", "observation": "Found Microsoft Clarity tracking script", "confidence": 95, "version": "1.2.3" }
]
[/INST]`;

    let attempts = 0;
    while (attempts < this.keys.length || attempts === 0) {
      const key = this.getNextKey();
      if (!key) break;

      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 1500, return_full_text: false }
          }),
        });

        if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);

        const result = await response.json();
        let text = result[0]?.generated_text || '';
        
        // Sometimes the AI returns markdown blocks like ```json ... ```
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
          // Attempt to extract array from string if preceded by conversational text
          const firstBracket = text.indexOf('[');
          const lastBracket = text.lastIndexOf(']');
          if (firstBracket !== -1 && lastBracket !== -1) {
            const cleanJsonStr = text.slice(firstBracket, lastBracket + 1);
            return JSON.parse(cleanJsonStr);
          }
          return JSON.parse(text); // direct parse fallback
        } catch(parseError) {
          console.error("AI JSON Parse Error:", parseError, "Raw Text:", text);
          return [];
        }
      } catch (error) {
        attempts++;
      }
    }
    return [];
  }

  getFallbackTips(attackType) {
    const fallbacks = {
      'XSS': {
        reproTip: 'Look for parameters reflecting in the DOM. Use polyglots like <svg/onload=alert(1)> to test for sanitization bypasses and check common sinks like innerHTML or eval().',
        recommendation: 'Use strict output encoding and a solid Content Security Policy (CSP).'
      },
      'SQL Injection': {
        reproTip: 'Test for time-based responses using payloads like SLEEP(10). Use Boolean-based inference (1=1 vs 1=2) to confirm vulnerability when results are not visible.',
        recommendation: 'Implement parameterized queries/prepared statements and input validation white-listing.'
      },
      'SSRF': {
        reproTip: 'Point parameters to internal metadata services (169.254.169.254) or internal IP ranges. Attempt DNS rebinding or double-encoding to bypass URL filters.',
        recommendation: 'Disable unused protocols and implement strict allow-lists for destination URLs.'
      },
      'CSRF': {
        reproTip: 'Create a self-submitting HTML form on a controlled domain that triggers a sensitive action. Check if the application accepts requests without a valid CSRF token.',
        recommendation: 'Implement anti-CSRF tokens and enforce SameSite=Strict cookie attributes.'
      },
      'IDOR': {
        reproTip: 'Swap numeric IDs with others in the same session. Check if sequential ID guessing (indexing) is possible to access or modify data belonging to other users.',
        recommendation: 'Implement robust object-level access control checks (AOAC) for every request.'
      },
      'LFI/RFI': {
        reproTip: 'Try path traversal sequences like ../../../etc/passwd or C:\\Windows\\win.ini. For RFI, attempt to load a remote script via URLs like http://attacker.com/shell.txt.',
        recommendation: 'Avoid passing user input directly to filesystem APIs; use a strict mapping or allow-list of files.'
      },
      'RCE': {
        reproTip: 'Identify injection points in system calls (exec, spawn) or template engines. Attempt to break out of commands using delimiters like &&, ;, or | followed by id or whoami.',
        recommendation: 'Avoid using dangerous functions like eval(); use secure sandboxes or restricted APIs.'
      },
      'Prototype Pollution': {
        reproTip: 'Attempt to inject properties via __proto__ or constructor.prototype keys in JSON inputs. Check if these properties persist across object instances.',
        recommendation: 'Validate input schemas and use Object.create(null) for un-pollutable data objects.'
      },
      'XXE': {
        reproTip: 'Inject external entity definitions in the XML body: <!ENTITY xxe SYSTEM "file:///etc/passwd">. Reference the entity as &xxe; to trigger a local file read.',
        recommendation: 'Disable DTD and external entity processing in all XML parsers.'
      },
      'Insecure Deserialization': {
        reproTip: 'Capture and decode serialized application tokens. Attempt to modify object properties or inject malicious objects that trigger code execution upon reconstruction.',
        recommendation: 'Avoid deserializing untrusted data; use safer data formats like JSON instead.'
      },
      'GraphQL Injection': {
        reproTip: 'Abuse introspection queries to map the entire schema. Attempt to use circular fragments to cause DoS or bypass depth limits to exfiltrate bulk data.',
        recommendation: 'Disable introspection in production and implement strict query depth/complexity limits.'
      },
      'Open Redirect': {
        reproTip: 'Identify redirect parameters like ?url= or ?next=. Attempt to bypass domain filters using double-encoding, null bytes, or the @ symbol (e.g., trusted.com@attacker.com).',
        recommendation: 'Use a strict allow-list of trusted redirect destinations or relative URLs only.'
      },
      'Information Disclosure': {
        reproTip: 'Scan for accidentally exposed files like .env, .git, or .bash_history. Check if verbose error messages reveal system internals or source code paths.',
        recommendation: 'Harden production error handling and ensure sensitive files are excluded from the web root.'
      },
      'Security Misconfiguration': {
        reproTip: 'Search for default credentials on management panels (e.g., /admin). Check if directory listing is enabled or if sensitive headers (HSTS, CSP) are missing.',
        recommendation: 'Audit configurations against hardening benchmarks and disable all unnecessary features/interfaces.'
      },
      'Broken Access Control': {
        reproTip: 'Identify endpoints meant for higher-privileged users. Attempt to access administrative functions by manually changing cookies, JWT roles, or API paths.',
        recommendation: 'Adopt a deny-by-default policy and verify the authorization on every single request.'
      },
      'CRLF Injection': {
        reproTip: 'Inject Carriage Return and Line Feed characters (%0D%0A) into headers. Attempt to split the HTTP response to inject malicious headers or execute XSS.',
        recommendation: 'Sanitize all user-supplied input to remove newline characters before using them in HTTP headers.'
      },
      'Host Header Injection': {
        reproTip: 'Manipulate the Host header or X-Forwarded-Host to point to an attacker domain. Check if the server uses this value for generating password reset links.',
        recommendation: 'Strictly validate the Host header against a whitelist and avoid using it for server-side logic.'
      },
      'Cache Poisoning': {
        reproTip: 'Identify unkeyed headers (like X-Forwarded-Host) reflected in the response. Craft a request that stores a malicious response in the cache for other users.',
        recommendation: 'Only cache responses that are independent of unkeyed inputs and use Vary headers correctly.'
      },
      'Clickjacking': {
        reproTip: 'Attempt to load the target application in an iframe on a controlled domain. Verify if action-triggering buttons can be overlaid with hidden elements.',
        recommendation: 'Implement X-Frame-Options: DENY or frame-ancestors "none" in Content Security Policy.'
      },
      'Improper Session Management': {
        reproTip: 'Check if session IDs are predictable or persist after logout. Verify if the Secure, HttpOnly, and SameSite flags are set on all sensitive cookies.',
        recommendation: 'Generate long, random session IDs and rotate them upon every successful authentication.'
      },
      'OAuth Misconfiguration': {
        reproTip: 'Tamper with the redirect_uri parameter to send authorization codes to an attacker site. Check if the "state" parameter is missing or predictable.',
        recommendation: 'Enforce strict redirect_uri matching and always validate the "state" parameter to prevent CSRF.'
      }
    };
    return fallbacks[attackType] || {
      reproTip: 'Analyze the component version history and check for similar past CVEs to identify common weak points.',
      recommendation: 'Keep dependencies updated and follow the principle of least privilege.'
    };
  }
}

export default new AIService();
