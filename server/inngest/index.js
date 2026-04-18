import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "vk-studio-movies" });

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    trigger: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data; 

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
      };

      console.log("User Data:", userData);

      const newUser = await User.create(userData);

      console.log("User Saved:", newUser);
    } catch (error) {
      console.log("User Creation Error:", error);
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    trigger: { event: "clerk/user.deleted" }, 
  },
  async ({ event }) => {
    try {
      const { id } = event.data;

      const deletedUser = await User.findByIdAndDelete(id);

      console.log("Deleted User:", deletedUser);
    } catch (error) {
      console.log("User Deletion Error:", error);
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    trigger: { event: "clerk/user.updated" },
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
      };

      const updatedUser = await User.findByIdAndUpdate(id, userData, {
        new: true,
      });

      console.log("Updated User:", updatedUser);
    } catch (error) {
      console.log("User Update Error:", error);
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];