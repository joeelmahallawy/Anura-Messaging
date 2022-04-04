import React from "react";
import { Box, Center, Tag, Tooltip } from "@chakra-ui/react";
import { ImWarning } from "react-icons/im";
// const AlphaTooltip = React.forwardRef(({ children, ...rest }, ref) => (
//   <Box p="1">
//     <Tag ref={ref} {...rest}>
//       {children}
//     </Tag>
//   </Box>
// ));

const AlphaTooltip = () => (
  <Box>
    <Tooltip
      position="initial"
      placement="left-end"
      hasArrow
      label="This project is in alpha. Don't send any private or confidential information!"
      aria-label="A tooltip"
    >
      <ImWarning />
    </Tooltip>
  </Box>
);

export default AlphaTooltip;
