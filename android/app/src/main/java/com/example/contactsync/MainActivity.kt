package com.example.contactsync

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private val contactPermissionCode = 100

    private lateinit var btnSync: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var tvStatus: TextView

    private lateinit var contactRepository: ContactRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnSync = findViewById(R.id.btnSync)
        progressBar = findViewById(R.id.progressBar)
        tvStatus = findViewById(R.id.tvStatus)

        contactRepository = ContactRepository(contentResolver)

        btnSync.setOnClickListener {
            if (checkPermission()) {
                startSync()
            } else {
                requestPermission()
            }
        }
    }

    private fun checkPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this, Manifest.permission.READ_CONTACTS
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.READ_CONTACTS),
            contactPermissionCode
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == contactPermissionCode) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startSync()
            } else {
                tvStatus.text = getString(R.string.permission_denied)
            }
        }
    }

    private fun startSync() {
        btnSync.isEnabled = false
        progressBar.visibility = View.VISIBLE
        tvStatus.text = getString(R.string.syncing)

        // TODO: Replace with an actual authenticated user ID from your auth system.
        // Using a placeholder ID for demonstration purposes.
        val userId = "user_001"

        lifecycleScope.launch {
            try {
                val contacts = contactRepository.getDeviceContacts()
                if (contacts.isEmpty()) {
                    tvStatus.text = getString(R.string.no_contacts_found)
                } else {
                    val result = contactRepository.uploadContacts(userId, contacts)
                    tvStatus.text = getString(R.string.sync_success, result.count)
                }
            } catch (e: Exception) {
                tvStatus.text = getString(R.string.sync_error, e.message)
            } finally {
                progressBar.visibility = View.GONE
                btnSync.isEnabled = true
            }
        }
    }
}