
import { Box, Button, useMediaQuery } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getWhatsAppLink } from '@/components/constants/whatsapp';

type CTASectionProps = {
  title: string;
  size?: string;
  selectedUnit?: string;
  MOQ?: number;
};

const CTASection = ({ title, size, selectedUnit, MOQ }: CTASectionProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleWhatsAppEnquiry = () => {
    const summary = `I am looking for ${title ? `the product: ${title}` : ''}${size ? `, Size: ${size}` : ''}${selectedUnit ? `, Unit: ${selectedUnit}` : ''}${MOQ ? `, MOQ: ${MOQ}` : ''}.`;
    window.open(getWhatsAppLink(summary), '_blank');
  };

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          justifyContent: 'center',
          width: '100%',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            // handleAddToList()
          }}
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: isMobile ? '100%' : 'auto',
            borderRadius: '999px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            py: 1.2,
            px: 2,
            bgcolor: '#3b82f6', // blue
            '&:hover': {
              bgcolor: '#2563eb',
            },
          }}
        >
          Add to Quote
        </Button>

        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          onClick={handleWhatsAppEnquiry}
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: isMobile ? '100%' : 'auto',
            borderRadius: '999px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            py: 1.2,
            px: 2,
            bgcolor: '#1e7b3c',
            color: '#fff',
            '&:hover': {
              bgcolor: '#166534',
            },
            whiteSpace: 'nowrap',
          }}
        >
          Enquire
        </Button>
      </Box>
      {/* Example usage of props for future UI: */}
      {/* <Box sx={{ mt: 2, textAlign: 'center', color: '#555', fontSize: '0.95rem' }}>
        <div>Product: {title}</div>
        <div>Size: {size}</div>
        <div>Unit: {selectedUnit}</div>
        <div>MOQ: {MOQ}</div>
      </Box> */}
    </Box>
  );
};

export default CTASection;
