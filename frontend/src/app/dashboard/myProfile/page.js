'use client';

import { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =============================
     Fetch User
  ============================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            title: data.user.title || "",
            phone: data.user.phone || "",
            location: data.user.location || "",
            bio: data.user.bio || "",
            skills: data.user.skills?.join(", ") || ""
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* =============================
     Handle Save
  ============================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            skills: formData.skills
              .split(",")
              .map(s => s.trim())
              .filter(Boolean)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Update failed");
      }

      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 text-slate-800">

      <h1 className="text-2xl font-bold text-slate-900">
        My Profile
      </h1>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <Navbar />
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            {isEditing ? (
              <input
                className="border px-3 py-2 rounded-lg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <h2 className="text-xl font-semibold text-slate-900">
                {user?.name}
              </h2>
            )}

            {isEditing ? (
              <input
                className="border px-3 py-2 rounded-lg mt-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            ) : (
              <p className="text-slate-500 text-sm">
                {user?.title || "No title added"}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={saving}
          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
        >
          {saving
            ? "Saving..."
            : isEditing
            ? "Save Changes"
            : "Edit Profile"}
        </button>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-2">
          About
        </h3>

        {isEditing ? (
          <textarea
            className="w-full border rounded-lg p-3"
            rows="4"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
          />
        ) : (
          <p className="text-slate-600 text-sm">
            {user?.bio || "No bio added yet."}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Details
        </h3>

        <div className="space-y-3 text-sm">
          <p><span className="font-medium">Email:</span> {user?.email}</p>

          {isEditing ? (
            <>
              <input
                className="border px-3 py-2 rounded-lg w-full"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 rounded-lg w-full"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <p><span className="font-medium">Phone:</span> {user?.phone || "Not provided"}</p>
              <p><span className="font-medium">Location:</span> {user?.location || "Not provided"}</p>
            </>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Skills
        </h3>

        {isEditing ? (
          <input
            className="border px-3 py-2 rounded-lg w-full"
            placeholder="Comma separated skills"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />
        ) : user?.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-teal-50 text-teal-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">
            No skills added yet.
          </p>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;