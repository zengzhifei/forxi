<script setup>
import { ref, computed } from 'vue'

const rawJwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
)

const ALGORITHM_DESCRIPTIONS = {
  HS256: 'HMAC using SHA-256',
  HS384: 'HMAC using SHA-384',
  HS512: 'HMAC using SHA-512',
  RS256: 'RSASSA-PKCS1-v1_5 using SHA-256',
  RS384: 'RSASSA-PKCS1-v1_5 using SHA-384',
  RS512: 'RSASSA-PKCS1-v1_5 using SHA-512',
  ES256: 'ECDSA using P-256 and SHA-256',
  ES384: 'ECDSA using P-384 and SHA-384',
  ES512: 'ECDSA using P-521 and SHA-512',
  none: 'No digital signature or MAC performed',
}

const CLAIM_DESCRIPTIONS = {
  typ: 'Type',
  alg: 'Algorithm',
  iss: 'Issuer',
  sub: 'Subject',
  aud: 'Audience',
  exp: 'Expiration Time',
  nbf: 'Not Before',
  iat: 'Issued At',
  jti: 'JWT ID',
  name: 'Full name',
  given_name: 'Given name(s) or first name(s)',
  family_name: 'Surname(s) or last name(s)',
  email: 'Preferred e-mail address',
  email_verified: 'Verified email',
  gender: 'Gender',
  birthdate: 'Birthday',
  zoneinfo: 'Time zone',
  locale: 'Locale',
  phone_number: 'Phone number',
  picture: 'Profile picture URL',
  website: 'Website URL',
  updated_at: 'Last updated',
  client_id: 'Client Identifier',
  scope: 'Scope Values',
  roles: 'Roles',
  groups: 'Groups',
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4
  if (pad) {
    str += '='.repeat(4 - pad)
  }
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    return atob(str)
  }
}

function decodeJwt(jwt) {
  try {
    const parts = jwt.split('.')
    if (parts.length !== 3) {
      return { header: [], payload: [], error: 'Invalid JWT format' }
    }

    const header = JSON.parse(base64UrlDecode(parts[0]))
    const payload = JSON.parse(base64UrlDecode(parts[1]))

    const parseClaims = (data) => {
      return Object.entries(data).map(([claim, value]) => {
        let formattedValue = value
        let friendlyValue = undefined

        if (typeof value === 'object') {
          formattedValue = JSON.stringify(value, null, 2)
        } else if (typeof value === 'number' && ['exp', 'nbf', 'iat'].includes(claim)) {
          const date = new Date(value * 1000)
          friendlyValue = date.toLocaleString()
          formattedValue = value.toString()
        }

        return {
          claim,
          value: formattedValue,
          claimDescription: CLAIM_DESCRIPTIONS[claim] || '',
          friendlyValue: claim === 'alg' ? ALGORITHM_DESCRIPTIONS[value] : friendlyValue,
        }
      })
    }

    return {
      header: parseClaims(header),
      payload: parseClaims(payload),
      error: null,
    }
  } catch (e) {
    return { header: [], payload: [], error: e.message }
  }
}

const decodedJWT = computed(() => decodeJwt(rawJwt.value))

const isValid = computed(() => {
  return !decodedJWT.value.error && decodedJWT.value.header.length > 0
})

const sections = [
  { key: 'header', title: 'Header' },
  { key: 'payload', title: 'Payload' },
]
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">JWT Token</label>
      <textarea
        v-model="rawJwt"
        class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
        placeholder="请输入 JWT Token..."
      />
    </div>

    <div v-if="decodedJWT.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600 text-sm">{{ decodedJWT.error }}</p>
    </div>

    <div v-if="isValid" class="flex-1 overflow-auto">
      <div v-for="section in sections" :key="section.key" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 text-center">{{ section.title }}</h3>
        <table class="w-full border-collapse">
          <tbody>
            <tr
              v-for="item in decodedJWT[section.key]"
              :key="item.claim"
              class="border-b border-gray-100"
            >
              <td class="py-2 px-3 font-medium text-gray-700 align-top w-40">
                {{ item.claim }}
                <span v-if="item.claimDescription" class="block text-xs text-gray-400 font-normal">
                  ({{ item.claimDescription }})
                </span>
              </td>
              <td class="py-2 px-3 text-gray-600 break-all font-mono text-sm">
                {{ item.value }}
                <span v-if="item.friendlyValue" class="ml-2 text-gray-400">
                  ({{ item.friendlyValue }})
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
