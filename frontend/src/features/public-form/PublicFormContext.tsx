// Contains all the shared props that will probably be passed down.
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
} from 'react'
import { UseQueryResult } from 'react-query'

import { MultirespondentSubmissionDto } from '~shared/types'
import { PublicFormViewDto } from '~shared/types/form'

import { decryptSubmission } from './utils/decryptSubmission'

export type SubmissionData = {
  /** Submission id */
  id: string | undefined
  /** Submission time in ms from epoch  */
  timestamp: number
}

export interface PublicFormContextProps
  extends Partial<PublicFormViewDto>,
    Omit<UseQueryResult<PublicFormViewDto>, 'data'> {
  miniHeaderRef: RefObject<HTMLDivElement>
  formId: string
  previousSubmissionId?: string
  /** Whether form authentication is required. */
  isAuthRequired: boolean
  /**
   * @note async function due to possibility of calling API to generate transactionId.
   * Get current verification transaction ID for the form.
   */
  getTransactionId: () => Promise<string>
  /**
   * The expiry time of current transaction, if it exists.
   * Is `null` if no transaction has been generated yet. */
  expiryInMs: number | null
  /** If form is submitted, submissionData will be defined. */
  submissionData?: SubmissionData
  /** Callback to be invoked when user submits public form. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmitForm: ((formInputs: any) => void) | undefined
  /** Callback to be invoked to logout of authenticated form, if user is logged in.  */
  handleLogout: (() => void) | undefined
  /** id of container to render captcha in.
   * Captcha will be instantiated if provided
   */
  captchaContainerId?: string
  /** Whether mobile section sidebar is open */
  isMobileDrawerOpen: boolean
  /**
   * Callbacks to be invoked when mobile section sidebar
   * is opened and closed
   */
  onMobileDrawerOpen: () => void
  onMobileDrawerClose: () => void

  /** Whether payment is enabled */
  isPaymentEnabled: boolean

  /** Whether it is a preview form */
  isPreview: boolean

  /** Sets the current number of visible fields in the form in public forms only*/
  setNumVisibleFields?: Dispatch<SetStateAction<number>>

  hasSingleSubmissionValidationError: boolean
  setHasSingleSubmissionValidationError: Dispatch<SetStateAction<boolean>>
  hasRespondentNotWhitelistedError: boolean

  encryptedPreviousSubmission?: MultirespondentSubmissionDto
  previousSubmission?: ReturnType<typeof decryptSubmission>
  previousAttachments?: Record<string, ArrayBuffer>
  setPreviousSubmission?: (
    previousSubmission: ReturnType<typeof decryptSubmission>,
  ) => void
}

export const PublicFormContext = createContext<
  PublicFormContextProps | undefined
>(undefined)

export const usePublicFormContext = (): PublicFormContextProps => {
  const context = useContext(PublicFormContext)
  if (!context) {
    throw new Error(
      `usePublicFormContext must be used within a PublicFormProvider component`,
    )
  }
  return context
}
