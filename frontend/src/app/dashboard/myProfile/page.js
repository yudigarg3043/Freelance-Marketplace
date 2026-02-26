'use client';

import { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
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
            skills: data.user.skills?.join(", ") || "",
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            skills: formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Update failed");
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Page Title + Edit Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              disabled={saving}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${isEditing
                  ? "bg-gradient-to-r from-teal-500 to-teal-700 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name || "",
                  title: user.title || "",
                  phone: user.phone || "",
                  location: user.location || "",
                  bio: user.bio || "",
                  skills: user.skills?.join(", ") || "",
                });
              }}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700"
            >
              ← Cancel editing
            </button>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-3 w-full">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                      <input
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                      <input
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. Full Stack Developer"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-900">{user?.name}</h2>
                    <p className="text-slate-500 text-sm">{user?.title || "No title added"}</p>
                    <p className="text-xs text-slate-400 mt-1 capitalize">{user?.role}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
            <h3 className="font-semibold text-slate-900 mb-3">About</h3>
            {isEditing ? (
              <textarea
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                rows="4"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed">
                {user?.bio || "No bio added yet."}
              </p>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
            <h3 className="font-semibold text-slate-900 mb-4">Details</h3>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input
                    className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-500 bg-slate-50 cursor-not-allowed"
                    value={user?.email}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                  <input
                    className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
                  <input
                    className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-slate-600 break-all">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="text-slate-600">{user?.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-slate-600">{user?.location || "Not provided"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Skills</h3>

            {isEditing ? (
              <div>
                <input
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />
                <p className="text-xs text-slate-400 mt-1">Separate skills with commas</p>
              </div>
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
              <p className="text-slate-500 text-sm">No skills added yet.</p>
            )}
          </div>

          {/* Mobile Save Button (sticky) */}
          {isEditing && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-3 sm:hidden z-40">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name || "",
                    title: user.title || "",
                    phone: user.phone || "",
                    location: user.location || "",
                    bio: user.bio || "",
                    skills: user.skills?.join(", ") || "",
                  });
                }}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;