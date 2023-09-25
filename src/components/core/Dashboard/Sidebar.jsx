import React, { useState } from "react";

import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import Sidebarlink from "./Sidebarlink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );

  const { loading: authLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);

  if (profileLoading || authLoading) {
    return <div className="mt-12">Loading...</div>;
  }

  return (
    <div className=" text-white">
      <div className="flex min-w-[222px] flex-col border border-r-2 border-r-richblack-200 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10  ">
        {/* starting links */}

        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <Sidebarlink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>

        {/* hr line */}
        <div className=" mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600 "></div>

        {/* setting and logout */}
        <div className="flex flex-col">
          <Sidebarlink
            link={{ name: "Settings", path: "dashboard/settings" }}
            iconName={"VscSettingsGear"}
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are You Sure ?",
                text2: "You Will be Logged Out of Your Account",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg"/>
              <span>Logout</span>
            </div>


          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

    </div>
  );
};

export default Sidebar;
