function LoginBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/10 blur-[150px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,249,255,0.7)_0%,rgba(239,244,255,0.6)_55%,rgba(230,238,255,0.55)_100%)]" />
    </div>
  )
}

export default LoginBackground
