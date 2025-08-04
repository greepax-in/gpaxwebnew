'use client';

import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ItemType } from '../../types/itemTypes';

type Props = {
  product: ItemType;
};

const ProductFAQ = ({ product }: Props) => {
  const faqs = product.faqs;
  const hasFAQs = faqs && faqs.length > 0;
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!hasFAQs) return null;

  return (
    <Box component="section" id="faqs" mt={2} px={isMobile ? 2 : 0}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Box component="span" mr={1}>❓</Box>
        Frequently Asked Questions
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {faqs.map((faq, index) => (
        <Accordion key={index} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`faq-content-${index}`}
            id={`faq-header-${index}`}
          >
            <Typography variant="subtitle2">{faq.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {faq.a}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* ✅ JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
              },
            })),
          }),
        }}
      />
    </Box>
  );
};

export default ProductFAQ;
