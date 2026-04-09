import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Typography
      color="text.secondary"
      variant="caption"
      sx={{ textAlign: 'center', display: 'block' }}
      fontWeight={500}
    >
      &copy; {new Date().getFullYear()} DNX Security Command. Built for focused stack defense.
    </Typography>
  );
};

export default Footer;
