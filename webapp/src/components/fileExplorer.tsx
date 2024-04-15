import { Button } from "@mui/material";
import { CloudUpload, Folder } from "@mui/icons-material";

export default function FileExplorer() {
  return (
    <div>
      {/* Todo figure out how to make normal-case */}
      <Button
        variant="contained"
        disableRipple={true}
        startIcon={<Folder />}
      >
        New Folder
      </Button>
      <Button
        variant="contained"
        disableRipple={true}
        startIcon={<CloudUpload />}
      >
        Upload File
      </Button>
    </div>
  );
};
