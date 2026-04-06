import express from "express";
import multer from "multer";
import MyUserController from "../controllers/MyUserController";
import verifyToken from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// /api/my/user
router.get("/", verifyToken, MyUserController.getCurrentUser);
router.post("/", verifyToken, MyUserController.createCurrentUser);
router.put(
  "/",
  verifyToken,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);
router.put(
  "/photo",
  verifyToken,
  upload.single("imageFile"),
  MyUserController.uploadUserPhoto
);

export default router;
