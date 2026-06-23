interface PlaceholderPageProps {
  description: string
  title: string
  variant?: 'embedded' | 'standalone'
}

export function PlaceholderPage({
  description,
  title,
  variant = 'standalone',
}: PlaceholderPageProps) {
  const wrapperClassName =
    variant === 'standalone'
      ? 'min-h-screen bg-slate-50 px-6 py-10 text-slate-900'
      : 'text-slate-900'

  const sectionClassName =
    variant === 'standalone'
      ? 'mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm'
      : 'rounded-lg border border-slate-200 bg-white p-8 shadow-sm'

  const ContentTag = variant === 'standalone' ? 'main' : 'div'

  return (
    <ContentTag className={wrapperClassName}>
      <section className={sectionClassName}>
        <p className="text-sm font-semibold text-teal-700">EMR Core</p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </section>
    </ContentTag>
  )
}
