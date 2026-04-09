import VulnerabilityCard from './VulnerabilityCard';
import SliderWrapper from 'components/common/SliderWrapper';
import { vulnerabilities } from 'data/vulnerabilities';

const DetectedVulnerabilities = () => {
  return (
    <SliderWrapper
      title="Detected Vulnerabilities"
      SliderCard={VulnerabilityCard}
      data={vulnerabilities}
    />
  );
};

export default DetectedVulnerabilities;
