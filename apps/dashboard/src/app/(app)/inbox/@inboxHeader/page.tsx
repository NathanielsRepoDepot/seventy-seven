import { TicketSearchForm } from '@/components/forms/ticket-search-form'
import { TicketFilterLoading, TicketFiltersServer } from '@/components/ticket-filters/ticket-filters.server'
import { Suspense } from 'react'

const InboxHeaderPage = () => {
  return (
    <div className="border-b flex justify-between gap-2 p-2">
      <TicketSearchForm className="md:max-w-md" />

      <Suspense fallback={<TicketFilterLoading />}>
        <TicketFiltersServer />
      </Suspense>
    </div>
  )
}

export default InboxHeaderPage
