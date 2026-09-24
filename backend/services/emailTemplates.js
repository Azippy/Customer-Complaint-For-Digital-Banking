const complaintSubmittedEmail = ({ firstName, complaintId }) => ({
  subject: "New Complaint Submitted",

  text: `
Hello ${firstName},

A new complaint (${complaintId}) has been submitted through the Complaint Management Portal.

Please log in to review and process the complaint.

Regards,
Complaint Management Portal
`,

  html: `
        <h2>New Complaint Submitted</h2>

        <p>Hello ${firstName},</p>

        <p>
            A new complaint
            <strong>${complaintId}</strong>
            has been submitted through the
            Complaint Management Portal.
        </p>

        <p>
            Please log in to review and process
            the complaint.
        </p>

        <p>
            Regards,<br>
            Complaint Management Portal
        </p>
    `,
});

const complaintAssignedEmail = ({ firstName, complaintId }) => ({
  subject: "Complaint Assigned",

  text: `
Hello ${firstName},

Complaint ${complaintId} has been assigned to you.

Please log in to the Complaint Management Portal to review it.

Regards,
Complaint Management Portal
`,

  html: `
        <h2>Complaint Assigned</h2>

        <p>Hello ${firstName},</p>

        <p>
            Complaint
            <strong>${complaintId}</strong>
            has been assigned to you.
        </p>

        <p>
            Please log in to the
            Complaint Management Portal
            to review it.
        </p>

        <p>
            Regards,<br>
            Complaint Management Portal
        </p>
    `,
});

const complaintStartedEmail = ({ firstName, complaintId }) => ({
  subject: "Complaint Is Now Being Processed",

  text: `
Hello ${firstName},

Your complaint ${complaintId} is now being processed by our support team.

You can log in to track its progress.

Regards,
Complaint Management Portal
`,

  html: `
        <h2>Complaint In Progress</h2>

        <p>Hello ${firstName},</p>

        <p>
            Your complaint
            <strong>${complaintId}</strong>
            is now being processed by our support team.
        </p>

        <p>
            You can log in to track its progress.
        </p>

        <p>
            Regards,<br>
            Complaint Management Portal
        </p>
    `,
});

const complaintCommentedEmail = ({ firstName, complaintId }) => ({
  subject: "New Reply on Your Complaint",

  text: `
Hello ${firstName},

There is a new comment on complaint ${complaintId}.

Please log in to view the conversation.

Regards,
Complaint Management Portal
`,

  html: `
        <h2>New Complaint Reply</h2>

        <p>Hello ${firstName},</p>

        <p>
            There is a new comment on complaint
            <strong>${complaintId}</strong>.
        </p>

        <p>
            Please log in to view the conversation.
        </p>

        <p>
            Regards,<br>
            Complaint Management Portal
        </p>
    `,
});

const complaintResolvedEmail = ({ firstName, complaintId }) => ({
  subject: "Complaint Resolved",

  text: `
Hello ${firstName},

Your complaint ${complaintId} has been resolved.

Please log in to review the resolution.

Regards,
Complaint Management Portal
`,

  html: `
        <h2>Complaint Resolved</h2>

        <p>Hello ${firstName},</p>

        <p>
            Your complaint
            <strong>${complaintId}</strong>
            has been resolved.
        </p>

        <p>
            Please log in to review the resolution.
        </p>

        <p>
            Regards,<br>
            Complaint Management Portal
        </p>
    `,
});

const complaintRejectedEmail = ({ firstName, complaintId, reason }) => ({
  subject: "Complaint Rejected",

  text: `
Hello ${firstName},

Your complaint ${complaintId} has been rejected.

Reason:
${reason}

Please log in to the Complaint Management Portal for more information.

Regards,
Complaint Management Portal
`,

  html: `
        <h2>Complaint Rejected</h2>

        <p>Hello ${firstName},</p>

        <p>
            Your complaint
            <strong>${complaintId}</strong>
            has been rejected.
        </p>

        <p>
            <strong>Reason:</strong>
            ${reason}
        </p>

        <p>
            Please log in to the
            Complaint Management Portal
            for more information.
        </p>

        <p>
            Regards,<br>
            Complaint Management Portal
        </p>
    `,
});

module.exports = {
  complaintSubmittedEmail,
  complaintAssignedEmail,
  complaintStartedEmail,
  complaintCommentedEmail,
  complaintResolvedEmail,
  complaintRejectedEmail,
};
