import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { SvgIconProps } from "@mui/material/SvgIcon";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CakeIcon from "@mui/icons-material/Cake";
import RocketIcon from "@mui/icons-material/Rocket";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CelebrationIcon from "@mui/icons-material/Celebration";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import NatureIcon from "@mui/icons-material/Nature";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type MegaMenuSection = {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  items: string[];
};

const paperCoversMenuSections: MegaMenuSection[][] = [
  [
    {
      icon: <LocalHospitalIcon sx={{ color: "#d32f2f", mr: 1 }} />,
      title: "Medical & Pharmaceutical",
      items: [
        "Kraft Plain Medical Paper Covers",
        "Kraft Printed Medical Paper Covers",
      ],
    },
    {
      icon: <CelebrationIcon sx={{ color: "#ab47bc", mr: 1 }} />,
      title: "Bakery Paper Covers",
      items: [
        "Bakery Plain Paper Covers",
        "Bakery Printed Paper Covers",
      ],
    },
  ],
  [
    {
      icon: <BlurOnIcon sx={{ color: "#1976d2", mr: 1 }} />,
      title: "Grocery or SOS Paper Covers",
      items: [
        "Kraft Plain Grocery Paper Covers",
        "Kraft Printed Grocery Paper Covers",
      ],
    },
    {
      icon: <NatureIcon sx={{ color: "#43a047", mr: 1 }} />,
      title: "Vegetable Paper Covers",
      items: [
        "Kraft Plain Vegetable Paper Covers",
        "Kraft Printed Vegetable Paper Covers",
      ],
    },
  ],
  [
    {
      icon: <EmojiPeopleIcon sx={{ color: "#ab47bc", mr: 1 }} />,
      title: "Textile Paper Covers",
      items: [
        "Kraft Plain Textile Paper Covers",
        "Kraft Printed Textile Paper Covers",
      ],
    },
    {
      icon: <LocalLaundryServiceIcon sx={{ color: "#fbc02d", mr: 1 }} />,
      title: "Laundry Paper Covers",
      items: [
        "Kraft Plain Laundry Paper Covers",
        "Kraft Printed Laundry Paper Covers",
      ],
    },
    {
      icon: <AutoAwesomeIcon sx={{ color: "#1976d2", mr: 1 }} />,
      title: "Custom Paper Covers",
      items: [],
    },
  ],
];

const paperBagsMenuSections: MegaMenuSection[][] = [
  [
    {
      icon: <RestaurantIcon sx={{ color: "#f9a825", mr: 1 }} />,
      title: "Food Delivery",
      items: [
        "Kraft Plain Food Delivery Paper Bags",
        "Kraft Printed Food Delivery Paper Bags",
      ],
    },
    {
      icon: <CakeIcon sx={{ color: "#ab47bc", mr: 1 }} />,
      title: "Cake Box Paper Bags",
      items: [
        "Kraft Plain Cake Box Paper Bags",
        "Kraft Printed Cake Box Paper Bags",
      ],
    },
  ],
  [
    {
      icon: <RocketIcon sx={{ color: "#1976d2", mr: 1 }} />,
      title: "Promotion Paper Bags",
      items: [
        "Kraft Printed Promotion Paper Bags",
        "Multicolor Promotion Paper Bags",
      ],
    },
    {
      icon: <CardGiftcardIcon sx={{ color: "#fbc02d", mr: 1 }} />,
      title: "Gift Paper Bags",
      items: [
        "Kraft Printed Gift Paper Bags",
        "Multicolor Gift Paper Bags",
      ],
    },
  ],
  [
    {
      icon: <CheckroomIcon sx={{ color: "#388e3c", mr: 1 }} />,
      title: "Garment Paper Bags",
      items: [
        "Kraft Printed Garment Paper Bags",
        "Multicolor Garment Paper Bags",
      ],
    },
    {
      icon: <ShoppingBagIcon sx={{ color: "#d32f2f", mr: 1 }} />,
      title: "Custom Paper Bags",
      items: [
        "Kraft Printed Custom Paper Bags",
        "Multicolor Custom Paper Bags",
      ],
    },
  ],
];

const paperBoxesMenuSections: MegaMenuSection[][] = [
  [
    {
      icon: <CakeIcon sx={{ color: "#f9a825", mr: 1 }} />,
      title: "Cake Boxes",
      items: [
        "Kraft Plain Cake Box",
        "Kraft Printed Cake Box",
        "White Plain Cake Box",
        "Printed Cake Box",
      ],
    },
  ],
  [
    {
      icon: <LunchDiningIcon sx={{ color: "#1976d2", mr: 1 }} />,
      title: "Burger Boxes",
      items: [
        "Kraft Plain Burger Box",
        "Kraft Printed Burger Box",
        "White Plain Burger Box",
        "Printed Burger Box",
      ],
    },
  ],
  [
    {
      icon: <LunchDiningIcon sx={{ color: "#388e3c", mr: 1 }} />,
      title: "Custom Paper Boxes",
      items: [],
    },
  ],
];

type MegaMenuProps = {
  open: boolean;
  // anchorEl?: HTMLElement | null;
  menuType: "Paper Bags" | "Paper Boxes" | "Paper Covers";
};

const getMenuSections = (menuType: MegaMenuProps["menuType"]) => {
  switch (menuType) {
    case "Paper Bags":
      return paperBagsMenuSections;
    case "Paper Boxes":
      return paperBoxesMenuSections;
    case "Paper Covers":
      return paperCoversMenuSections;
    default:
      return [];
  }
};

export default function MegaMenu({ open, menuType }: MegaMenuProps) {
  if (!open) return null;

  const sectionGroups = getMenuSections(menuType);

  // Height logic: Paper Bags uses sum, Paper Boxes uses max items per section, Paper Covers uses sum
let height;
if (menuType === "Paper Bags") {
    const maxGroupItems = Math.max(
        ...sectionGroups.map(group => group.reduce((acc, section) => acc + section.items.length, 0))
    );
    height = (80 + maxGroupItems * 32) * 1.1;
} else if (menuType === "Paper Covers") {
    // For Paper Covers, use the sum of all items across all groups
    const totalItems = sectionGroups.flat().reduce((acc, section) => acc + section.items.length, 0);
    height = (1 + totalItems * 22) * 1.1;
} else if (menuType === "Paper Boxes") {
    const maxItemsInSection = Math.max(
        ...sectionGroups.flat().map(section => section.items.length)
    );
    height = (25 + maxItemsInSection * 32) * 1.1;
} else {
    height = 400;
}

  let minWidth;
  if (menuType === "Paper Boxes") {
    // Reduce width for Paper Boxes menu
    minWidth = 800;
  } else {
    const sectionCount = sectionGroups.length;
    minWidth = Math.max(290 * sectionCount, 220) * 1.1;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "60px",
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          minWidth: minWidth,
          maxWidth: "1200px",
          height: `${height}px`,
          alignItems: "flex-start",
          transition: "min-width 0.2s, height 0.2s",
          marginLeft: "auto", // Center horizontally
          marginRight: "auto", // Center horizontally
        }}
      >
        {sectionGroups.map((group, groupIdx) => (
          <React.Fragment key={groupIdx}>
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 220, px: 3 }}>
              {group.map((section) => (
                <Box key={section.title} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {section.icon}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {section.title}
                    </Typography>
                  </Box>
                  {section.items.map((item) => (
                    <Typography key={item} variant="body2" sx={{ mb: 0.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>
            {groupIdx < sectionGroups.length - 1 && (
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}