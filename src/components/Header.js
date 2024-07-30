"use client";

import Image from "next/legacy/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        padding: "26px 0 26px 0",
        borderBottom: "1px solid #32374033",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Image
        // className={styles["logo"]}
        src={"/logo-kitchen.png"}
        width={"139px"}
        height={"15px"}
        alt="logo"
        className="kitchen-logo"
      />
    </Box>
  );
};

export default Header;
