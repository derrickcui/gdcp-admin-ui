import React from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";

const styles = {
    textField: {
        fontSize:12
    }
}

const GlTextField = styled(props => (
    <TextField size="small" variant="outlined" InputProps={{ style: styles.textField  }} {...props} />
))`
  .root.focused:after {
    border-color: green;
  }
`;

export default GlTextField;