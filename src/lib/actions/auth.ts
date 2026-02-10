"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { put } from "@vercel/blob"
import prisma from "@/lib/prisma"
import { signIn } from "@/lib/auth"

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = (formData.get("name") as string) || undefined
  const profileImageFile = formData.get("profileImage") as File | null

  if (!email?.trim() || !password?.trim()) {
    return { error: "Email and password are required" }
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const existing = await prisma.user.findUnique({ where: { email: email.trim() } })
  if (existing) {
    return { error: "An account with this email already exists" }
  }

  let profileImageUrl: string | null = null
  if (profileImageFile && profileImageFile.size > 0) {
    try {
      const buffer = await profileImageFile.arrayBuffer()
      const blob = await put(`profile-images/${Date.now()}-${profileImageFile.name}`, buffer, {
        access: "public",
        contentType: profileImageFile.type,
      })
      profileImageUrl = blob.url
    } catch (error) {
      console.error("Image upload error:", error)
      return { error: "Failed to upload profile image" }
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      email: email.trim(),
      password: hashedPassword,
      name: name?.trim() || null,
      profileImage: profileImageUrl,
    },
  })

  await signIn("credentials", {
    email: email.trim(),
    password,
    redirectTo: "/",
  })
  redirect("/")
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email?.trim() || !password?.trim()) {
    return { error: "Email and password are required" }
  }

  try {
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirectTo: "/",
      redirect: false,
    })
    if (result?.error) {
      return { error: "Invalid email or password" }
    }
  } catch {
    return { error: "Invalid email or password" }
  }
  redirect("/")
}
