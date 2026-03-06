package com.example.contactsync

// Request model sent to backend
data class ContactRequest(
    val phone: String
)

data class UploadContactsRequest(
    val userId: String,
    val contacts: List<ContactRequest>
)

// Response model received from backend
data class UploadContactsResponse(
    val success: Boolean,
    val message: String,
    val count: Int
)
