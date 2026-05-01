import type { RegistrationRequest } from "@/types/auth";
import type { User } from "@/types/user";

function AgreementText() {
  return (
    <div className="text-sm text-muted space-y-3 max-h-48 overflow-y-auto border border-default p-3 bg-default">
      <p>
        You agree, through your use of this forum, that you will not post any
        material which is false, defamatory, inaccurate, abusive, vulgar,
        hateful, harassing, obscene, profane, sexually oriented, threatening,
        invasive of a person's privacy, adult material, or otherwise in
        violation of any International or United States Federal law. You also
        agree not to post any copyrighted material unless you own the copyright
        or you have written consent from the owner of the copyrighted material.
        Spam, flooding, advertisements, chain letters, pyramid schemes, and
        solicitations are also forbidden on this forum.
      </p>
      <p>
        Note that it is impossible for the staff or the owners of this forum to
        confirm the validity of posts. Please remember that we do not actively
        monitor the posted messages, and as such, are not responsible for the
        content contained within. We do not warrant the accuracy, completeness,
        or usefulness of any information presented. The posted messages express
        the views of the author, and not necessarily the views of this forum,
        its staff, its subsidiaries, or this forum's owner. Anyone who feels
        that a posted message is objectionable is encouraged to notify an
        administrator or moderator of this forum immediately. The staff and the
        owner of this forum reserve the right to remove objectionable content,
        within a reasonable time frame, if they determine that removal is
        necessary. This is a manual process, however, please realize that they
        may not be able to remove or edit particular messages immediately. This
        policy applies to member profile information as well.
      </p>
      <p>
        You remain solely responsible for the content of your posted messages.
        Furthermore, you agree to indemnify and hold harmless the owners of this
        forum, any related websites to this forum, its staff, and its
        subsidiaries. The owners of this forum also reserve the right to reveal
        your identity (or any other related information collected on this
        service) in the event of a formal complaint or legal action arising from
        any situation caused by your use of this forum.
      </p>
      <p>
        You have the ability, as you register, to choose your username. We
        advise that you keep the name appropriate. With this user account you
        are about to register, you agree to never give your password out to
        another person except an administrator, for your protection and for
        validity reasons. You also agree to NEVER use another person's account
        for any reason. We also HIGHLY recommend you use a complex and unique
        password for your account, to prevent account theft.
      </p>
      <p>
        After you register and login to this forum, you will be able to fill out
        a detailed profile. It is your responsibility to present clean and
        accurate information. Any information the forum owner or staff
        determines to be inaccurate or vulgar in nature will be removed, with or
        without prior notice. Appropriate sanctions may be applicable.
      </p>
      <p>
        Please note that with each post, your IP address is recorded, in the
        event that you need to be banned from this forum or your ISP contacted.
        This will only happen in the event of a major violation of this
        agreement.
      </p>
      <p>
        Also note that the software places a cookie, a text file containing bits
        of information (such as your username and password), in your browser's
        cache. This is ONLY used to keep you logged in/out. The software does
        not collect or send any other form of information to your computer.
      </p>
    </div>
  );
}

export default function UserRegistration() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit =
    agreed &&
    userName.trim() &&
    displayName.trim() &&
    email.trim() &&
    password.trim() &&
    !passwordMismatch;

  const registrationMutation = useBBMutation<RegistrationRequest, User>(
    () => ["/users/register", { userName, displayName, email, password }],
    () => navigate("/user/auth/login"),
  );

  if (registrationMutation.isSuccess) {
    return (
      <BBWidget widgetTitle="Registration Complete">
        <div className="p-4 space-y-2">
          <p>Your account has been created. You can now log in.</p>
          <BBLink to="/user/auth/login">Login</BBLink>
        </div>
      </BBWidget>
    );
  }

  return (
    <div className="space-y-4">
      <BBWidget widgetTitle="Register — Required Information">
        <div className="p-4 space-y-4">
          {registrationMutation.isError && (
            <p className="text-highlighted text-sm">
              Registration failed. The username or email may already be in use.
            </p>
          )}
          <BBForm>
            <div className="space-y-4">
              <div className="space-y-1">
                <BBInput
                  label="Choose username:"
                  name="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <p className="text-xs text-dimmed">
                  Used to log in to your account.
                </p>
              </div>
              <div className="space-y-1">
                <BBInput
                  label="Display name:"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className="text-xs text-dimmed">Shown on your posts.</p>
              </div>
              <div className="space-y-1">
                <BBInput
                  label="Email:"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-dimmed">
                  Must be a valid email address.
                </p>
              </div>
              <BBInput
                label="Choose password:"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="space-y-1">
                <BBInput
                  label="Verify password:"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordMismatch && (
                  <p className="text-xs text-highlighted">
                    The two passwords you entered are not the same.
                  </p>
                )}
              </div>
            </div>
          </BBForm>
        </div>
      </BBWidget>

      <BBWidget>
        <div className="p-4 space-y-4">
          <AgreementText />
          <div className="flex items-center gap-2">
            <input
              id="regagree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="regagree" className="text-sm font-bold text-muted">
              I Agree
            </label>
          </div>
          <button
            type="button"
            className="w-full p-2 bg-accented border border-default disabled:opacity-50"
            disabled={!canSubmit || registrationMutation.isPending}
            onClick={() => registrationMutation.mutate()}
          >
            {registrationMutation.isPending ? "Registering..." : "Register"}
          </button>
          <p className="text-sm text-dimmed text-center">
            Already have an account?{" "}
            <BBLink to="/user/auth/login">Login</BBLink>
          </p>
        </div>
      </BBWidget>
    </div>
  );
}
