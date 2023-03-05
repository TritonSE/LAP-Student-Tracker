import * as React from "react";
import MenuUnstyled, { MenuUnstyledActions } from "@mui/base/MenuUnstyled";
import MenuItemUnstyled, { menuItemUnstyledClasses } from "@mui/base/MenuItemUnstyled";
import styles from "./CreateOptions.module.css";
import { styled } from "@mui/system";

const blue = {
  100: "#DAECFF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledMenuItem = styled(MenuItemUnstyled)(
  ({ theme }) => `
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;
  background: #ffffff;
  
  &:hover {
    cursor: pointer
  }
  
  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &.${menuItemUnstyledClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:hover:not(.${menuItemUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }
  `
);
type CreateOptionProps = {
  handleClickClass: (state: boolean) => void;
  handleClickOneOffEvent: (state: boolean) => void;
};

const CreateOptions: React.FC<CreateOptionProps> = ({
  handleClickClass,
  handleClickOneOffEvent,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuActions = React.useRef<MenuUnstyledActions>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (isOpen) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      if (event.key === "ArrowUp") {
        menuActions.current?.highlightLastItem();
      }
    }
  };

  const close = (): void => {
    setAnchorEl(null);
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  const classClick = (): void => {
    close()
    handleClickClass(true)
  }

  const oneTimeEventClick = (): void => {
    close()
    handleClickOneOffEvent(true)
  }

  return (
    <div>
      <button
        className={styles.createBtn}
        type="button"
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        ref={buttonRef}
        aria-controls={isOpen ? "simple-menu" : undefined}
        aria-expanded={isOpen || undefined}
        aria-haspopup="menu"
      >
        Create
        <img className={styles.addIcon} src="/AddIcon.png" />
      </button>
      <MenuUnstyled
        className={styles.createMenu}
        actions={menuActions}
        open={isOpen}
        onClose={close}
        anchorEl={anchorEl}
      >
        <StyledMenuItem onClick={classClick}>Class</StyledMenuItem>
        <StyledMenuItem onClick={oneTimeEventClick}>One-off Event</StyledMenuItem>
      </MenuUnstyled>
    </div>
  );
};

export { CreateOptions };
