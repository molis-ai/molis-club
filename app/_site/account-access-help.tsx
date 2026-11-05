export function AccountAccessHelp() {
  return (
    <details className="m-auth-note" data-account-help>
      <summary className="m-link">无法使用登录方式？</summary>
      <p>
        还有可用方式：用它登录，在“登录方式与密码”验证身份后绑定或换绑。
        仅忘记邮箱密码，可在登录页选择“找回密码”。
      </p>
      <p>
        全部方式都已丢失：先向邮箱服务商、手机运营商或 Google、GitHub
        找回原登录方式，再回来登录。
      </p>
      <p>
        Molis 暂不提供人工账号恢复。新注册账号不会自动继承原账号的资料和内容。
      </p>
    </details>
  );
}
