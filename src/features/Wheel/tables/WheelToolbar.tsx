import { Button } from "@mui/material";
import useQueryParams from "@/shared/providers/useQueryParams";
import { Add } from "@mui/icons-material";

const WheelToolbar = () => {
  const { setUrlParams } = useQueryParams();

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() =>
          setUrlParams({
            createWheel: "true",
          })
        }
      >
        Create Wheel
      </Button>
    </div>
  );
};

export default WheelToolbar;
