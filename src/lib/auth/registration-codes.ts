import { Types } from "mongoose";
import { sendVerificationCode } from "@/lib/auth/verification-service";
import { isSmsConfigured } from "@/lib/auth/verification-policy";
import { classifyEmailError, type EmailFailure } from "@/lib/email/error-reason";

/**
 * After registration: the primary confirmation code goes to the buyer's phone (SMS)
 * and the secondary code goes to the company email. A failure on one channel never
 * blocks the other or the registration itself.
 */
export async function sendRegistrationCodes(input: {
  userId: string | Types.ObjectId;
  email: string;
  phone?: string;
  name?: string;
}): Promise<{
  devEmailCode?: string;
  devPhoneCode?: string;
  emailSent: boolean;
  emailFailure?: EmailFailure;
}> {
  const out: {
    devEmailCode?: string;
    devPhoneCode?: string;
    emailSent: boolean;
    emailFailure?: EmailFailure;
  } = {
    emailSent: false,
  };

  if (input.phone?.trim() && isSmsConfigured()) {
    try {
      const phone = await sendVerificationCode({
        userId: input.userId,
        channel: "phone",
        purpose: "phone_verify",
        destination: input.phone.trim(),
        name: input.name,
      });
      out.devPhoneCode = phone.devCode;
    } catch (error) {
      console.error("[registration] phone code", error);
    }
  }

  try {
    const email = await sendVerificationCode({
      userId: input.userId,
      channel: "email",
      purpose: "email_verify",
      destination: input.email,
      name: input.name,
    });
    out.devEmailCode = email.devCode;
    out.emailSent = true;
  } catch (error) {
    out.emailFailure = classifyEmailError(error);
    console.error("[registration] email code", out.emailFailure.code, error);
  }

  return out;
}
