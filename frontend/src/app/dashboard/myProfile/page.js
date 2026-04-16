"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/Layout/DashboardSidebar";

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
            portfolio: data.user.portfolio || [],
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

  const [resumeFile, setResumeFile] = useState(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");

      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'portfolio') {
          dataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          dataToSend.append(key, formData[key]);
        }
      });

      if (resumeFile) {
        dataToSend.append('resume', resumeFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: dataToSend,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Update failed");
      setUser(data.user);
      setIsEditing(false);
      setResumeFile(null); // Reset file selection
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
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar role={user?.role || "freelancer"} />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto">

            {/* Edit Button */}
            <div className="flex items-center justify-end mb-6">
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
                  {user.role === 'freelancer' && (
                    <div className="pt-2 border-t border-slate-100 mt-2">
                       <label className="block text-xs font-bold text-slate-700 mb-2">Resume (PDF, Max 1MB)</label>
                       <div className="flex flex-col gap-2">
                          <input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          />
                          {user.resume && (
                            <p className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              Current Resume Uploaded
                            </p>
                          )}
                       </div>
                    </div>
                  )}
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
                  {user.resume && (
                    <div className="pt-2 border-t border-slate-100 mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-teal-600 hover:underline">
                        View Resume (PDF)
                      </a>
                    </div>
                  )}
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

            {/* Portfolio Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-4 mb-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Portfolio</h3>
                {isEditing && (
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        portfolio: [
                          ...formData.portfolio,
                          { title: "", description: "", link: "", imageUrl: "" },
                        ],
                      });
                    }}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>+ Add Project</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {(isEditing ? formData.portfolio : user?.portfolio)?.length > 0 ? (
                  (isEditing ? formData.portfolio : user.portfolio).map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 group relative"
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <input
                              className="w-full bg-transparent font-bold text-slate-900 focus:outline-none border-b border-transparent focus:border-teal-500"
                              placeholder="Project Title"
                              value={item.title}
                              onChange={(e) => {
                                const newPortfolio = [...formData.portfolio];
                                newPortfolio[index].title = e.target.value;
                                setFormData({ ...formData, portfolio: newPortfolio });
                              }}
                            />
                            <button
                              onClick={() => {
                                const newPortfolio = formData.portfolio.filter((_, i) => i !== index);
                                setFormData({ ...formData, portfolio: newPortfolio });
                              }}
                              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                          <textarea
                            className="w-full bg-transparent text-sm text-slate-600 focus:outline-none border-b border-transparent focus:border-teal-500 resize-none"
                            placeholder="Brief description..."
                            rows="2"
                            value={item.description}
                            onChange={(e) => {
                              const newPortfolio = [...formData.portfolio];
                              newPortfolio[index].description = e.target.value;
                              setFormData({ ...formData, portfolio: newPortfolio });
                            }}
                          />
                          <input
                            className="w-full bg-transparent text-xs text-teal-600 focus:outline-none border-b border-transparent focus:border-teal-500"
                            placeholder="Project Link (optional)"
                            value={item.link}
                            onChange={(e) => {
                              const newPortfolio = [...formData.portfolio];
                              newPortfolio[index].link = e.target.value;
                              setFormData({ ...formData, portfolio: newPortfolio });
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-teal-600 hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No portfolio items added yet.</p>
                )}
              </div>
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
                      portfolio: user.portfolio || [],
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
      </div>
    </div>
  );
};

export default ProfilePage;