import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { getPublicPortfolioBySlug, type PublicPortfolioRecord } from '../api/portfolioPublications'
import PublicPortfolioView from '../components/portfolio/PublicPortfolioView'

function PublicPortfolioScreen() {
  const { slug } = useParams()
  const [portfolio, setPortfolio] = useState<PublicPortfolioRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setIsLoading(false)
      setIsNotFound(true)
      return
    }
    const targetSlug = slug ?? ''

    let isActive = true

    async function loadPublicPortfolio() {
      setIsLoading(true)
      setIsNotFound(false)
      setErrorMessage(null)

      try {
        const record = await getPublicPortfolioBySlug(targetSlug)
        if (!isActive) {
          return
        }

        setPortfolio(record)
      } catch (error) {
        if (!isActive) {
          return
        }

        if (error instanceof ApiError && error.status === 404) {
          setIsNotFound(true)
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load this portfolio.')
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadPublicPortfolio()

    return () => {
      isActive = false
    }
  }, [slug])

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center">Loading portfolio...</div>
  }

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-12 text-center">
        <p className="text-xl font-semibold">Portfolio not found</p>
        <p className="opacity-80">The requested public portfolio is unavailable.</p>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-12 text-center">
        <p className="text-xl font-semibold">Unable to load portfolio</p>
        <p className="opacity-80">{errorMessage}</p>
        <Link to="/login" className="btn btn-primary mt-2">Sign In</Link>
      </div>
    )
  }

  if (!portfolio) {
    return null
  }

  return (
    <div className="min-h-screen bg-(--surface) text-(--on-surface)">
      <PublicPortfolioView portfolio={portfolio} />
    </div>
  )
}

export default PublicPortfolioScreen
