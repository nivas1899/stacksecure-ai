export type OsvEcosystem = 'npm' | 'PyPI' | 'Maven' | 'Packagist' | 'Go' | 'RubyGems';

export interface TechVuln {
  type: string;
  description: string;
  severity: 'Critical' | 'Medium' | 'Low';
  fix: string;
}

export interface StackTech {
  id: string;
  name: string;
  packageName: string;
  ecosystem: OsvEcosystem;
  category: string;
  icon: string;
  versions: string[];
  knownVulns: TechVuln[];
}

const tech = (
  id: string,
  name: string,
  packageName: string,
  ecosystem: OsvEcosystem,
  category: string,
  icon: string,
  versions: string[],
): StackTech => ({
  id,
  name,
  packageName,
  ecosystem,
  category,
  icon,
  versions,
  knownVulns: [],
});

export const stackTechs: StackTech[] = [
  tech('react', 'React', 'react', 'npm', 'Frontend', 'logos:react', ['18.2.0', '18.0.0', '17.0.2', '16.14.0']),
  tech('nextjs', 'Next.js', 'next', 'npm', 'Frontend', 'logos:nextjs-icon', ['14.0.4', '13.5.6', '12.3.4', '11.1.4']),
  tech('vue', 'Vue', 'vue', 'npm', 'Frontend', 'logos:vue', ['3.4.21', '3.3.4', '2.7.16', '2.6.14']),
  tech('angular', 'Angular', '@angular/core', 'npm', 'Frontend', 'logos:angular-icon', ['17.3.0', '16.2.12', '15.2.10', '14.3.0']),
  tech('svelte', 'Svelte', 'svelte', 'npm', 'Frontend', 'logos:svelte-icon', ['4.2.12', '4.0.5', '3.59.2', '3.55.1']),
  tech('nuxt', 'Nuxt', 'nuxt', 'npm', 'Frontend', 'logos:nuxt-icon', ['3.10.3', '3.8.2', '2.17.3', '2.15.8']),
  tech('jquery', 'jQuery', 'jquery', 'npm', 'Frontend', 'logos:jquery', ['3.7.1', '3.6.4', '2.2.4', '1.12.4']),
  tech('bootstrap', 'Bootstrap', 'bootstrap', 'npm', 'Frontend', 'logos:bootstrap', ['5.3.3', '5.2.3', '4.6.2', '3.4.1']),
  tech('tailwind', 'Tailwind CSS', 'tailwindcss', 'npm', 'Frontend', 'logos:tailwindcss-icon', ['3.4.1', '3.3.5', '3.2.7', '2.2.19']),
  tech('redux-toolkit', 'Redux Toolkit', '@reduxjs/toolkit', 'npm', 'Frontend', 'logos:redux', ['2.2.1', '2.0.1', '1.9.7', '1.8.6']),
  tech('react-native', 'React Native', 'react-native', 'npm', 'Mobile', 'logos:react', ['0.73.5', '0.72.7', '0.71.14', '0.68.7']),

  tech('nodejs', 'Node.js', 'node', 'npm', 'Runtime', 'logos:nodejs-icon', ['20.11.0', '18.19.0', '16.20.2', '14.21.3']),
  tech('express', 'Express', 'express', 'npm', 'Backend', 'simple-icons:express', ['4.18.2', '4.17.3', '4.16.4', '3.21.2']),
  tech('nestjs', 'NestJS', '@nestjs/core', 'npm', 'Backend', 'logos:nestjs', ['10.3.3', '9.4.3', '8.4.7', '7.6.18']),
  tech('fastify', 'Fastify', 'fastify', 'npm', 'Backend', 'simple-icons:fastify', ['4.26.2', '4.24.3', '3.29.5', '2.15.3']),
  tech('koa', 'Koa', 'koa', 'npm', 'Backend', 'simple-icons:koa', ['2.15.0', '2.14.2', '2.13.4', '1.7.0']),
  tech('hapi', 'Hapi', '@hapi/hapi', 'npm', 'Backend', 'simple-icons:hapi', ['21.3.7', '20.2.2', '19.2.0', '18.4.1']),
  tech('socketio', 'Socket.IO', 'socket.io', 'npm', 'Backend', 'logos:socket.io', ['4.7.5', '4.6.2', '3.1.2', '2.5.0']),
  tech('apollo-server', 'Apollo Server', '@apollo/server', 'npm', 'Backend', 'simple-icons:apollographql', ['4.10.0', '4.8.1', '3.13.0', '2.26.2']),
  tech('graphql', 'GraphQL', 'graphql', 'npm', 'Backend', 'logos:graphql', ['16.8.1', '16.6.0', '15.8.0', '14.7.0']),
  tech('passport', 'Passport', 'passport', 'npm', 'Auth', 'simple-icons:passport', ['0.7.0', '0.6.0', '0.5.3', '0.4.1']),
  tech('jsonwebtoken', 'JSON Web Token', 'jsonwebtoken', 'npm', 'Auth', 'simple-icons:jsonwebtokens', ['9.0.2', '8.5.1', '7.4.3', '5.7.0']),
  tech('bcrypt', 'bcrypt', 'bcrypt', 'npm', 'Auth', 'simple-icons:bcrypt', ['5.1.1', '5.0.1', '4.0.1', '3.0.8']),
  tech('helmet', 'Helmet', 'helmet', 'npm', 'Security', 'simple-icons:helmet', ['7.1.0', '6.2.0', '5.1.1', '4.6.0']),
  tech('zod', 'Zod', 'zod', 'npm', 'Validation', 'simple-icons:zod', ['3.22.4', '3.21.4', '3.20.6', '3.19.1']),
  tech('axios', 'Axios', 'axios', 'npm', 'HTTP Client', 'logos:axios', ['1.6.7', '1.5.1', '0.27.2', '0.21.4']),
  tech('lodash', 'Lodash', 'lodash', 'npm', 'Utility', 'logos:lodash', ['4.17.21', '4.17.20', '4.17.19', '4.17.15']),
  tech('moment', 'Moment.js', 'moment', 'npm', 'Utility', 'simple-icons:moment', ['2.30.1', '2.29.4', '2.24.0', '2.19.3']),
  tech('mongoose', 'Mongoose', 'mongoose', 'npm', 'Database', 'simple-icons:mongoose', ['8.2.1', '7.6.3', '6.13.0', '5.13.22']),
  tech('prisma', 'Prisma', 'prisma', 'npm', 'Database', 'simple-icons:prisma', ['5.10.2', '5.7.1', '4.16.2', '3.15.2']),
  tech('sequelize', 'Sequelize', 'sequelize', 'npm', 'Database', 'simple-icons:sequelize', ['6.37.1', '6.32.1', '5.22.5', '4.44.4']),
  tech('mongodb-driver', 'MongoDB Driver', 'mongodb', 'npm', 'Database', 'logos:mongodb-icon', ['6.3.0', '5.9.2', '4.17.2', '3.7.4']),
  tech('typescript', 'TypeScript', 'typescript', 'npm', 'Build Tool', 'logos:typescript-icon', ['5.4.2', '5.3.3', '4.9.5', '4.4.4']),
  tech('vite', 'Vite', 'vite', 'npm', 'Build Tool', 'logos:vitejs', ['5.1.4', '4.5.2', '3.2.10', '2.9.16']),
  tech('webpack', 'Webpack', 'webpack', 'npm', 'Build Tool', 'logos:webpack', ['5.90.3', '5.76.0', '4.47.0', '3.12.0']),
  tech('eslint', 'ESLint', 'eslint', 'npm', 'Build Tool', 'logos:eslint', ['8.57.0', '8.45.0', '7.32.0', '6.8.0']),

  tech('django', 'Django', 'django', 'PyPI', 'Python', 'logos:django-icon', ['5.0.3', '4.2.11', '3.2.25', '2.2.28']),
  tech('flask', 'Flask', 'flask', 'PyPI', 'Python', 'logos:flask', ['3.0.2', '2.3.3', '2.2.5', '1.1.4']),
  tech('fastapi', 'FastAPI', 'fastapi', 'PyPI', 'Python', 'simple-icons:fastapi', ['0.110.0', '0.104.1', '0.95.2', '0.75.2']),
  tech('requests', 'Requests', 'requests', 'PyPI', 'Python', 'simple-icons:python', ['2.31.0', '2.28.2', '2.25.1', '2.20.0']),
  tech('numpy', 'NumPy', 'numpy', 'PyPI', 'Python', 'logos:numpy', ['1.26.4', '1.24.4', '1.22.4', '1.19.5']),
  tech('pandas', 'Pandas', 'pandas', 'PyPI', 'Python', 'simple-icons:pandas', ['2.2.1', '2.0.3', '1.5.3', '1.3.5']),
  tech('tensorflow', 'TensorFlow', 'tensorflow', 'PyPI', 'AI/ML', 'logos:tensorflow', ['2.15.0', '2.13.1', '2.10.1', '2.8.4']),
  tech('pytorch', 'PyTorch', 'torch', 'PyPI', 'AI/ML', 'logos:pytorch-icon', ['2.2.1', '2.1.2', '1.13.1', '1.10.2']),
  tech('scikit-learn', 'scikit-learn', 'scikit-learn', 'PyPI', 'AI/ML', 'simple-icons:scikitlearn', ['1.4.1', '1.3.2', '1.2.2', '0.24.2']),
  tech('sqlalchemy', 'SQLAlchemy', 'sqlalchemy', 'PyPI', 'Database', 'simple-icons:sqlalchemy', ['2.0.27', '1.4.52', '1.3.24', '1.2.19']),
  tech('celery', 'Celery', 'celery', 'PyPI', 'Queue', 'simple-icons:celery', ['5.3.6', '5.2.7', '4.4.7', '4.0.2']),
  tech('jinja2', 'Jinja2', 'jinja2', 'PyPI', 'Template', 'simple-icons:jinja', ['3.1.3', '3.0.3', '2.11.3', '2.10.1']),
  tech('pyyaml', 'PyYAML', 'pyyaml', 'PyPI', 'Parser', 'simple-icons:yaml', ['6.0.1', '5.4.1', '5.3.1', '3.13']),

  tech('spring-core', 'Spring Framework', 'org.springframework:spring-core', 'Maven', 'Java', 'logos:spring-icon', ['6.1.4', '5.3.32', '5.2.25.RELEASE', '4.3.30.RELEASE']),
  tech('struts', 'Apache Struts', 'org.apache.struts:struts2-core', 'Maven', 'Java', 'simple-icons:apache', ['6.3.0.2', '6.1.2.1', '2.5.33', '2.3.37']),
  tech('log4j', 'Log4j Core', 'org.apache.logging.log4j:log4j-core', 'Maven', 'Java', 'simple-icons:apache', ['2.23.0', '2.20.0', '2.17.1', '2.14.1']),
  tech('jackson-databind', 'Jackson Databind', 'com.fasterxml.jackson.core:jackson-databind', 'Maven', 'Java', 'simple-icons:json', ['2.16.1', '2.15.3', '2.13.5', '2.9.10']),

  tech('laravel', 'Laravel', 'laravel/framework', 'Packagist', 'PHP', 'logos:laravel', ['10.48.0', '9.52.16', '8.83.27', '6.20.44']),
  tech('symfony', 'Symfony', 'symfony/symfony', 'Packagist', 'PHP', 'logos:symfony', ['6.4.4', '5.4.36', '4.4.51', '3.4.47']),
  tech('wordpress', 'WordPress', 'johnpbloch/wordpress', 'Packagist', 'CMS', 'logos:wordpress-icon', ['6.5.5', '6.4.5', '6.3.4', '5.9.9']),
  tech('guzzle', 'Guzzle', 'guzzlehttp/guzzle', 'Packagist', 'HTTP Client', 'simple-icons:php', ['7.8.1', '7.5.0', '6.5.8', '6.3.3']),

  tech('gin', 'Gin', 'github.com/gin-gonic/gin', 'Go', 'Go', 'simple-icons:go', ['1.9.1', '1.8.2', '1.7.7', '1.6.3']),
  tech('gorilla-mux', 'Gorilla Mux', 'github.com/gorilla/mux', 'Go', 'Go', 'simple-icons:go', ['1.8.1', '1.8.0', '1.7.4', '1.6.2']),
  tech('rails', 'Ruby on Rails', 'rails', 'RubyGems', 'Ruby', 'logos:rails', ['7.1.3', '7.0.8', '6.1.7.7', '5.2.8.1']),
  tech('rack', 'Rack', 'rack', 'RubyGems', 'Ruby', 'simple-icons:ruby', ['3.0.9', '2.2.8', '2.1.4', '1.6.13']),
];
