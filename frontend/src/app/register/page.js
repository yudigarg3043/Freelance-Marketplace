"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/credentials/Header";

const Register = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    title: "",
    phone: "",
    location: "",
    bio: "",
    hourlyRate: "",
    skills: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please select your account type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        role: selectedRole,
        skills:
          selectedRole === "freelancer"
            ? form.skills.split(",").map((s) => s.trim())
            : [],
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 items-center justify-center p-12">
        <div className="text-center text-white space-y-6 max-w-lg">
          <h2 className="text-4xl font-bold">Join FreelanceHub Today</h2>
          <p className="text-white/80 text-lg">
            Create your account and start connecting with opportunities
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <Header />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Create an account
            </h1>
            <p className="text-slate-500">
              Get started with your free account today
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-900">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("freelancer")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "freelancer"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:border-teal-300"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  Work as Freelancer
                </p>
                <p className="text-xs text-slate-500">Find jobs & earn</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "client"
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:border-teal-300"
                }`}
              >
                <p className="font-semibold text-slate-900">
                  Hire Freelancers
                </p>
                <p className="text-xs text-slate-500">Post jobs & hire</p>
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <label className="block text-sm font-medium text-slate-900">
              Name <span className="text-sm font-large text-red-400">*</span>
            </label>
            <input
              name="name"
              placeholder="Full Name"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-700"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label className="block text-sm font-medium text-slate-900">
              Email <span className="text-sm font-large text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-700"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <label className="block text-sm font-medium text-slate-900">
                Password <span className="text-sm font-large text-red-400">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 text-slate-700"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                👁
              </button>
            </div>

            <label className="block text-sm font-medium text-slate-900">
              Title
            </label>
            <input
              name="title"
              placeholder="Professional Title"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-700"
              value={form.title}
              onChange={handleChange}
            />

            <label className="block text-sm font-medium text-slate-900">
              Location
            </label>
            <input
              name="location"
              placeholder="Location"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-700"
              value={form.location}
              onChange={handleChange}
            />

            <label className="block text-sm font-medium text-slate-900">
              Phone Number <span className="text-sm font-large text-red-400">*</span>
            </label>
            <input
              name="phone"
              placeholder="Phone"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-700"
              value={form.phone}
              onChange={handleChange}
            />

            {selectedRole === "freelancer" && (
              <>
                <label className="block text-sm font-medium text-slate-900">
                  Bio
                </label>
                <textarea
                  name="bio"
                  placeholder="Short Bio"
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-700"
                  value={form.bio}
                  onChange={handleChange}
                />

                <label className="block text-sm font-medium text-slate-900">
                  Skills
                </label>
                <input
                  name="skills"
                  placeholder="Skills (comma separated)"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-700"
                  value={form.skills}
                  onChange={handleChange}
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;