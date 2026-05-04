import * as v from "valibot";

export const LoginFormSchema = v.object({
  username: v.pipe(v.string(), v.nonEmpty("Username is required.")),
  password: v.pipe(v.string(), v.nonEmpty("Password is required.")),
  stayLoggedIn: v.boolean(),
});

export type LoginForm = v.InferOutput<typeof LoginFormSchema>;

export const RegistrationFormSchema = v.pipe(
  v.object({
    userName: v.pipe(v.string(), v.nonEmpty("Username is required.")),
    displayName: v.pipe(v.string(), v.nonEmpty("Display name is required.")),
    email: v.pipe(
      v.string(),
      v.nonEmpty("Email is required."),
      v.email("Must be a valid email address."),
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty("Password is required."),
      v.minLength(8, "Password must be at least 8 characters."),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please confirm your password."),
    ),
    agreed: v.literal(true, "You must agree to the terms to register."),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "The two passwords you entered are not the same.",
    ),
    ["confirmPassword"],
  ),
);

export type RegistrationForm = v.InferOutput<typeof RegistrationFormSchema>;
