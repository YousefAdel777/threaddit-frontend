import { useState } from "react";
import MenuButton from "@/features/common/components/MenuButton";
import Menu from "@/features/common/components/Menu";
import MenuItem from "@/features/common/components/MenuItem";
import { FaCheck, FaX } from "react-icons/fa6";

type Props = {
    status: ReportStatus,
    handleReportUpdate: (status: ReportStatus) => void
}

const ReportMenu = ({ status, handleReportUpdate }: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="relative">
            <MenuButton 
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />
            {
                isMenuOpen &&
                <Menu>
                    {
                        status !== "reviewed" &&
                        <MenuItem onClick={() => handleReportUpdate("reviewed")}>
                            <FaCheck className="text-xl text-primary" />
                            Mark as reviewed
                        </MenuItem>
                    }
                    {
                        status !== "dismissed" &&
                        <MenuItem className="text-red-500" onClick={() => handleReportUpdate("dismissed")}>
                            <FaX className="text-xl" />
                            Dismiss
                        </MenuItem>
                    }
                </Menu>
            }
        </div>
        // {
        //     status === "pending" &&
        //     <div className="flex items-center gap-3">
        //         <Button className="bg-red-500" onClick={() => handleReportUpdate("dismissed")}>
        //             Dismiss
        //         </Button>
        //         <Button onClick={() => handleReportUpdate("reviewed")}>
        //             Mark as reviewed
        //         </Button>
        //     </div>
        // }
    )
}

export default ReportMenu;