const checkCaptcha = async (TURNSTILE_SECRET_KEY, turnstileToken) =>{
    const captchaRes = await $fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
            secret: TURNSTILE_SECRET_KEY,
            response: turnstileToken,
        }),
    });
    return captchaRes;
}

export default checkCaptcha;