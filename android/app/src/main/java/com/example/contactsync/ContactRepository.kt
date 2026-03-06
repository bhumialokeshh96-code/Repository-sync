package com.example.contactsync

import android.content.ContentResolver
import android.provider.ContactsContract
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ContactRepository(private val contentResolver: ContentResolver) {

    /**
     * Reads all phone contacts from the device.
     * Cleans numbers (removes spaces and special characters), validates 10-digit numbers,
     * and removes duplicates.
     *
     * @return List of unique 10-digit phone numbers as ContactRequest objects.
     */
    suspend fun getDeviceContacts(): List<ContactRequest> = withContext(Dispatchers.IO) {
        val phoneSet = mutableSetOf<String>()

        val projection = arrayOf(ContactsContract.CommonDataKinds.Phone.NUMBER)
        val cursor = contentResolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            projection,
            null,
            null,
            null
        )

        cursor?.use {
            val numberIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
            while (it.moveToNext()) {
                val rawNumber = it.getString(numberIndex) ?: continue
                val cleaned = rawNumber.replace(Regex("[^\\d]"), "")
                // Accept only exactly 10-digit numbers
                if (cleaned.length == 10) {
                    phoneSet.add(cleaned)
                }
            }
        }

        phoneSet.map { ContactRequest(phone = it) }
    }

    /**
     * Uploads the given contacts to the backend server.
     *
     * @param userId The identifier for the current user.
     * @param contacts List of contacts to upload.
     * @return UploadContactsResponse on success, or throws an exception on failure.
     */
    suspend fun uploadContacts(userId: String, contacts: List<ContactRequest>): UploadContactsResponse {
        val request = UploadContactsRequest(userId = userId, contacts = contacts)
        val response = RetrofitClient.apiService.uploadContacts(request)
        if (response.isSuccessful) {
            return response.body() ?: throw Exception("Empty response body")
        } else {
            throw Exception("Upload failed: HTTP ${response.code()}")
        }
    }
}
