import React, { useState } from "react";
import HandlesForm from "./components/HandlesForm";
import UnsolvedProblemsComponent from "./components/UnsolvedProblemsComponent";
import { Box } from "@mui/material";

const App: React.FC = () => {
  const [handles, setHandles] = useState<string[]>([]);

  const handleAddHandle = (handle: string) => {
    setHandles((prevHandles) => [...prevHandles, handle]);
  };

  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
   
    >
      <HandlesForm onAddHandle={handleAddHandle} />
      {handles.length > 0 && <UnsolvedProblemsComponent handles={handles} />}
    </div>
  );
};

export default App;
