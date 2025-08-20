export function VerificationEmail(verifyUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        background-color: white;
        margin: 0;
        padding: 0;
        font-family: system-ui, sans-serif;
        color: #27272a;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #000000;
          color: #e4e4e7;
        }
        .container {
          background-color: #000000;
          box-shadow: 0 1px 0 0 #27272a inset, 0 -1px 0 0 #27272a inset;
        }
        .btn {
          background: linear-gradient(225deg, #18181b, #121212);
          box-shadow: 0 1px 0 0 #27272a inset, 0 -1px 0 0 #27272a inset;
        }
      }
      .container {
        max-width: 480px;
        width: 100%;
        margin: 8vh auto 0 auto;
        padding: 2rem;
        background-color: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
      }
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: #27272a;
      }
      .btn {
        display: block;
        width: 100%;
        height: 40px;
        border-radius: 0.375rem;
        background: linear-gradient(
          225deg,
          #000000,
          #525252
        );
        color: white;
        font-weight: 500;
        font-family: inherit;
        border: none;
        cursor: pointer;
        position: relative;
        box-shadow: inset 0 1px 0 0 #ffffff66, inset 0 -1px 0 0 #ffffff66;
        text-align: center;
        line-height: 40px;
        text-decoration: none;
        user-select: none;
      }
      .btn:hover {
        opacity: 0.9;
      }
      a {
        color: inherit;
        text-decoration: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Please confirm your email address by clicking the button below:</h2>
      <button class="btn">
        <a href="${verifyUrl}">Verify Email →</a>
      </button>
    </div>
  </body>
</html>`
}
