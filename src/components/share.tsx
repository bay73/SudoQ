import React from 'react';
import {Button, ClickAwayListener, Tooltip} from '@mui/material';
import {LinkSharp} from "@mui/icons-material"

interface Props {
  buttonText: string
  shareText: string
}

export function LinkShareButton(props: Props) {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const onButtonClick = function() {
    navigator.clipboard.writeText(props.shareText)
    setTooltipOpen(true);
  }


  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={tooltipOpen}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Link copied"
        >
          <Button variant='outlined' startIcon={<LinkSharp />} onClick = {onButtonClick}>{props.buttonText}</Button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};
