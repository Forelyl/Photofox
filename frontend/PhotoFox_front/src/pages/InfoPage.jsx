import { useSearchParams } from "react-router-dom";

export default function InfoPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'about';

    const terms = (
    <>
    <h1>PhotoFox Terms of Service</h1>
    <h2>Last Updated: June 4, 2024</h2>
    <p>
      Welcome to PhotoFox! By accessing or using the PhotoFox website, mobile applications, or any services (collectively, the "Service"), 
      you agree to comply with and be bound by the following terms and conditions (the "Terms of Service"). Please read them carefully. 
      If you do not agree to these terms, you may not use the Service.
    </p>
    
    <h3>1. Acceptance of Terms</h3>
    <p>
      By accessing or using the Service, you agree to be bound by these Terms of Service and our Privacy Policy. 
      If you are using the Service on behalf of an organization, you are agreeing to these 
      Terms on behalf of that organization and promising that you have the authority to bind the organization to these Terms.
    </p>

    <h3>2. Description of Service</h3>
    <p>
      PhotoFox is a visual discovery and bookmarking platform where users can discover and save creative ideas. 
      The Service includes the PhotoFox website, applications, and related services.
    </p>

    <h3>3. Eligibility</h3>
    <p>
      You must be at least 13 years old to use the Service. 
      By using the Service, you represent and warrant that you meet this age requirement and have the capacity to enter into a legally binding agreement.
    </p>

    <h3>4. User Accounts</h3>
    <ul>
      <li>
        <b>Registration</b>: To access certain features of the Service, you must create an account. 
        You agree to provide accurate, current, and complete information during the registration process.
      </li>
      <li>
        <b>Account Security</b>: You are responsible for safeguarding your password and for any activities or actions under your account. 
        You agree to notify PhotoFox immediately of any unauthorized use of your account.
      </li>
      <li>
        <b>Account Termination</b>: PhotoFox reserves the right to terminate or suspend your account at any time, with or without cause or notice.
      </li>
    </ul>

    
    <h3>5. User Content</h3>
    <ul>
      <li>
        <b>Content Ownership</b>: You retain all rights and ownership to your content. PhotoFox does not claim any ownership rights over your content.
      </li>
      <li>
        <b>License to PhotoFox</b>: By posting or sharing content on the Service, you grant PhotoFox a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, display, distribute, and reproduce such content in connection with the Service.
      </li>
      <li>
        <b>Content Responsibility</b>: You are solely responsible for the content you post. You agree not to post any content that is unlawful, defamatory, obscene, or otherwise objectionable.
      </li>
    </ul>

    <h3>6. Prohibited Activities</h3>
    You agree not to engage in any of the following prohibited activities:
    <ul>
      <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
      <li>Posting or transmitting any content that infringes any third party’s intellectual property or other rights.</li>
      <li>Attempting to interfere with or compromise the system integrity or security of the Service.</li>
      <li>Collecting or harvesting any personally identifiable information from the Service.</li>
      <li>Using the Service to distribute unsolicited promotional or commercial content.</li>
    </ul>

    <h3>7. Intellectual Property</h3>
    <ul>
        <li>
          <b>PhotoFox Content</b>: All rights, title, and interest in and to the Service, including but not limited to the software, images, text, graphics, and other content, 
          are owned by PhotoFox or its licensors.
        </li>
        <li>
          <b>Trademarks</b>: PhotoFox, the PhotoFox logo, and any other PhotoFox service names or slogans are trademarks of PhotoFox. 
          You may not use any of these without our prior written permission.
        </li>
    </ul>

    <h3>8. Privacy</h3>
    <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and share information about you.</p>

    <h3>9. Disclaimers and Limitation of Liability</h3>
    <ul>
      <li>
        <b>Service Provided "As-Is"</b>: The Service is provided on an "as-is" and "as-available" basis. 
        PhotoFox makes no warranties or representations about the accuracy or completeness of the Service’s content.
      </li>
      <li>
        <b>Limitation of Liability</b>: To the maximum extent permitted by law, PhotoFox shall not be liable for any indirect, incidental, 
        special, consequential, or punitive damages, or any loss of profits or revenues.
      </li>
    </ul>


    <h3>10. Indemnification</h3>
    <p>
      You agree to indemnify and hold harmless PhotoFox, its affiliates, and their respective officers, directors, employees, and agents from any claims, 
      liabilities, damages, losses, and expenses, including reasonable attorney’s fees, arising out of or in any way connected with your access to or use 
      of the Service, your violation of these Terms, or your infringement of any rights of another.
    </p>

    <h3>11. Modifications to the Service</h3>
    <p>
      PhotoFox reserves the right to modify, suspend, or discontinue the Service at any time, with or without notice. PhotoFox shall not be liable to you or any 
      third party for any modification, suspension, or discontinuation of the Service.
    </p>

    <h3>12. Governing Law and Dispute Resolution</h3>
    <p>
      These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which PhotoFox operates, 
      without regard to its conflict of law principles. Any disputes arising out of or relating to these Terms or the Service will be resolved through 
      binding arbitration in accordance with the rules of the American Arbitration Association.
    </p>
    
    <h3>13. General</h3>
    <ul>
      <li>
        <b>Entire Agreement</b>: These Terms, together with the Privacy Policy, constitute the entire agreement between you and PhotoFox regarding the use of the Service.
      </li>
      <li>
        <b>Severability</b>: If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
      </li>
      <li>
        <b>Waiver</b>: No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and 
        PhotoFox’s failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
      </li>
      <li>
        <b>Assignment</b>: You may not assign or transfer these Terms, by operation of law or otherwise, without PhotoFox’s prior written consent. 
        Any attempt by you to assign or transfer these Terms without such consent will be null and of no effect. PhotoFox may freely assign or transfer these Terms without restriction.
      </li>
    </ul>


    <h3>14. Contact Information</h3>
    If you have any questions about these Terms, please contact us at:<br />
    <br />
    <b>Email</b>: <a href="mailto:email@example.com">support@photofox.com</a><br />
    <b>Address</b>: PhotoFox, 123 Creative Lane, Imaginary City, IC 45678

    <h3>15. Changes to Terms of Service</h3>
    <p>
      PhotoFox reserves the right to change these Terms of Service at any time. When we do, we will revise the "Last Updated" date at the top of these Terms. 
      If the changes are significant, we will provide a more prominent notice (such as adding a statement to our homepage or sending you an email notification). 
      Your continued use of the Service following the posting of changes constitutes your acceptance of such changes.
    </p>

    <h3>16. Feedback</h3>
    <p>
      We welcome and encourage you to provide feedback, comments, and suggestions for improvements to the Service. 
      You may submit feedback by emailing us at <a href="mailto:email@example.com">feedback@photofox.com</a>. 
      You acknowledge and agree that all feedback will be the sole and exclusive property of PhotoFox, and you hereby irrevocably assign to PhotoFox all of your 
      right, title, and interest in and to all feedback, including any intellectual property rights therein.
    </p>

    <p>By using PhotoFox, you agree to these Terms of Service. If you do not agree, please do not use the Service.</p>

    <p>Thank you for using PhotoFox!</p>
    
    </>)


    
    switch (type) {
        case 'privacy':
            return (
                <>
                    {terms}
                </>
            );
        case 'terms':
            return (
                <>
                    {terms}
                </>
            );
        default:
            return (
                <>
                    <h1>This is about</h1>
                </>
            );
    }
    

}