import React, { useState } from "react";
import Password from "../../components/Password";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../features/authSlice";

function ChangePassword() {
  const { authUser, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const dispatch = useDispatch();
  const [showError, setshowError] = useState(error);

  const handleChangePassword = (e) => {
    e.preventDefault();

    dispatch(changePassword(formData));

    setshowError({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };
  return (
    <>
      {authUser !== null && (
        <div className="h-screen w-full flex flex-col gap-8 items-center justify-center">
          <div className="w-1/2 flex flex-col gap-10 bg-black/40 rounded-3xl py-20">
            <div className="text-[#928dab] text-3xl font-semibold text-center">
              Change Password
            </div>
            <div className="w-full">
              <form
                onSubmit={handleChangePassword}
                className="w-full flex flex-col items-center justify-center gap-6"
              >
                <Password
                  title="old password"
                  value={formData.oldPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                  placeholder="old Password"
                />
                <Password
                  title="new Password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="new password"
                />
                <Password
                  title="confirm old password"
                  value={formData.confirmNewPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  placeholder="confirm new password"
                />

                {showError && (
                  <p className="text-red-800 text-sm">{showError}</p>
                )}

                <button
                  type="submit"
                  className="bg-[#928dab] text-[#1f1c2c] w-3/4 py-2 rounded-2xl font-bold border-2 border-transparent cursor-pointer hover:border-[#928dab] hover:text-[#928dab] hover:bg-transparent transition-all duration-200 ease-in-out"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChangePassword;
