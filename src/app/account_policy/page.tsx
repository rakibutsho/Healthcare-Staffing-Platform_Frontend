import React from "react";

const AccountPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Account Policy</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            Account Deletion Policy
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Here is the step-by-step process to delete your account:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                <li><strong>Sign In:</strong> Log into the app using your account credentials.</li>
                <li><strong>Navigate to Profile:</strong> Access the profile section from the bottom navigation bar.</li>
                <li><strong>Locate Delete Option:</strong> Scroll down to the bottom of the profile screen to find the account deletion option.</li>
                <li><strong>Confirm Deletion:</strong> Select the option and confirm your choice to permanently delete the account.</li>
              </ol>
            </div>

            <p>
              Please read our account deletion policy carefully before proceeding
              with any account modifications.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-medium text-red-800">
                Important Notice Regarding Account Deletion
              </p>
              <p className="mt-2 text-red-700">
                If you choose to delete your profile, please be aware that this
                action has permanent consequences.
                <strong>
                  {" "}
                  You will not be able to use the same email address to create a
                  new account in the future.
                </strong>
              </p>
            </div>

            <p className="mt-6">
              This policy is in place to maintain the security and integrity of
              our platform. If you have any questions or are experiencing issues
              with your account, we encourage you to contact our support team
              before making a final decision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPolicy;
