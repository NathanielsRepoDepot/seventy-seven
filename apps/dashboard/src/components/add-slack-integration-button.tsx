'use client'

import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { useRouter } from 'next/navigation'

type Props = {
  url: string
}

export const AddSlackIntegrationButton = ({ url }: Props) => {
  const router = useRouter()

  const openPopup = () => {
    const width = 600
    const height = 800
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2.5

    const popup = window.open(
      url,
      '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
    )

    // The popup might have been blocked, so we redirect the user to the URL instead
    if (!popup) {
      window.location.href = url
      return
    }

    const listener = (e: MessageEvent) => {
      if (e.data === 'slack_oauth_completed') {
        router.refresh()
        window.removeEventListener('message', listener)
        popup.close()
      }
    }

    window.addEventListener('message', listener)
  }

  return (
    <Button
      className="gap-2"
      onClick={() => {
        openPopup()
      }}
    >
      <Icon name="plus" />
      Add slack integration
    </Button>
  )
}
