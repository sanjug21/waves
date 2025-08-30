'use client';

import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import { updateProfileDetails, updateProfileImage } from "@/hooks/profileHooks";
import { toast } from "react-toastify";
import { updateUserDp, setAuthenticated } from "@/store/slices/authSlice";
import { Pencil } from "lucide-react";

export default function ProfileImageEditor() {
  const dispatch = useDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const defImage = "/def.png";

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [nickname, setNickname] = useState(currentUser?.nickname || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [dob, setDob] = useState(currentUser?.dob || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [gender, setGender] = useState(currentUser?.gender || "");

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleEdit = () => setEditMode((prev) => !prev);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setNickname(currentUser.nickname || "");
      setBio(currentUser.bio || "");
      setPhone(currentUser.phone || "");
      setDob(currentUser.dob || "");
      setAddress(currentUser.address || "");
      setGender(currentUser.gender || "");
    }
  }, [currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerFilePicker = () => {
    if (preview) {
      setPreview(null);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSubmit = async () => {
    const inputEl = fileInputRef.current;
    if (!inputEl || !inputEl.files || inputEl.files.length === 0) {
      toast.error("No file selected.");
      return;
    }

    const file = inputEl.files[0];
    setLoading(true);
    setError(null);

    try {
      const result = await updateProfileImage(file);
      dispatch(updateUserDp(result.dp));
      toast.success("Profile picture updated successfully!");
      setPreview(null);
      inputEl.value = "";
    } catch (err: any) {
      setError("Failed to update profile picture.");
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDetails = async () => {
    try {
      const updatedFields = { name, nickname, bio, phone, dob, address, gender };
      await updateProfileDetails(updatedFields);
      dispatch(setAuthenticated({ ...currentUser!, ...updatedFields }));
      toast.success("Profile details updated successfully!");
      setEditMode(false);
    } catch (err: any) {
      toast.error("Failed to update profile details.");
      console.error("Update error:", err);
    }
  };

  return (
    <div className="w-full mb-6 flex flex-col items-center gap-6">
      {/* Profile Image Section */}
      <div className="ProfileBg relative w-full min-h-[300px] flex flex-col items-center justify-center pt-2 px-4 rounded-b-md overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
        <h1 className="absolute top-4 left-4 z-10 text-white text-xl sm:text-2xl font-semibold">
          Welcome, {currentUser?.name} 👋
        </h1>

        <div className="relative z-10 group mt-4">
          <div
            className="w-44 h-44 rounded-full overflow-hidden border-2 border-[rgb(0,12,60)] shadow-lg transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onClick={triggerFilePicker}
          >
            <img
              src={preview || currentUser?.dp || defImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gray-800/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs font-medium">
                {preview ? "Remove" : "Change"}
              </span>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {preview && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`z-10 relative mt-4 px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Profile Picture"}
          </button>
        )}

        {error && <p className="text-red-500 mt-2 text-sm z-10 relative">{error}</p>}
      </div>

      {/* Profile Details Form */}
      <div className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 space-y-6">
        {!editMode ? (
          <button
            onClick={toggleEdit}
            className="absolute top-4 right-4 text-gray-500 hover:text-[rgb(0,12,60)] transition-colors"
            title="Edit Profile"
          >
            <Pencil size={20} />
          </button>
        ) : (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setEditMode(false)}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
            >
              Cancel
            </button>
          </div>
        )}

        <Field label="Name" value={name} editable={editMode} onChange={setName} />
        <Field label="Nickname" value={nickname} editable={editMode} onChange={setNickname} />
        <Field label="Bio" value={bio} editable={editMode} onChange={setBio} type="textarea" />

        <hr className="border-t border-gray-200" />

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <p className="text-base text-gray-800">{currentUser?.email || "Add your email"}</p>
        </div>

        <Field label="Phone" value={phone} editable={editMode} onChange={setPhone} type="tel" />
        <Field label="Date of Birth" value={dob} editable={editMode} onChange={setDob} type="date" />
        <Field label="Address" value={address} editable={editMode} onChange={setAddress} type="textarea" />

        <div>
          <label className="block text-sm font-medium text-gray-600">Gender</label>
          {editMode ? (
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(0,12,60)] transition"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p className="text-base text-gray-800">{gender || "Add your gender"}</p>
          )}
        </div>

        {editMode && (
          <button
            onClick={updateDetails}
            className="w-full py-2 mt-6 rounded-full bg-[rgb(0,12,60)] hover:bg-[rgb(0,6,34)] text-white font-semibold transition duration-200"
          >
            Update Details
          </button>
        )}
      </div>
    </div>
       
  );
}
  function Field({
  label,
  value,
  editable,
  onChange,
  type = "text",
  placeholder = `Add your ${label.toLowerCase()}`
}: {
  label: string;
  value: string | undefined;
  editable: boolean;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {editable ? (
        type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(0,12,60)] transition"
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(0,12,60)] transition"
          />
        )
      ) : (
        <p className="text-base text-gray-800">{value || placeholder}</p>
      )}
    </div>
  );
}
