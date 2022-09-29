import { Box, Button, ListItem } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export const NavItem = (props:any) => {
  const { href, icon, title, ...others } = props;
  const location = useLocation();
  const active = href ? (location.pathname === href) : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
        justifyContent:'center'
      }}
      {...others}
    >
      <a
        href={href}
      >
        <Button
          component="a"
          startIcon={icon}
          disableRipple
          sx={{
            backgroundColor: active ? 'secondary.light':'primary.main',
            borderRadius: 1,
            color: active ? 'text.secondary' : 'text.primary',
            fontWeight: active ? 'fontWeightBold': 'fontWeightNormal',
            justifyContent: 'flex-start',
            px: 3,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? 'primary.main' : 'primary.dark'
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.19)'
            }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {title}
          </Box>
        </Button>
      </a>
    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string
};
