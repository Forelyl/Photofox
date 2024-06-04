import { Link, useSearchParams } from "react-router-dom";

export default function InfoPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'about';
    var titlePage;
    switch (type) {
        case 'privacy':
            titlePage = <h1>PhotoFox Privacy Policy</h1>;
            break;
        case 'about':
            titlePage = <h1>About Us</h1>
            break;
        default:
            titlePage = <h1>PhotoFox Terms of Service</h1>;
            break;
                        
    }

    const terms = (
      <>
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
    
      </>
    )

    const privacy = (
        <>
          <h2>Last Updated: June 4, 2024</h2>
          <p>
            At PhotoFox, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, 
            and related services (collectively, the "Service"). By using the Service, you agree to the terms of this Privacy Policy.
          </p>
  
          <h3>1. Information We Collect</h3>
          <p>
            We collect various types of information in connection with the Service, including:
          </p>
          <h4>a. Personal Information</h4>
          <ul>
            <li>
              <b>Account Information</b>: When you create an account, we collect your name, 
              email address, username, password, and profile picture.
            </li>
            <li>
              <b>Contact Information</b>: When you contact us for support or provide feedback, we collect your name, 
              email address, and any other information you choose to provide.
            </li>
          </ul>
          <h4>b. Usage Information</h4>
          <ul>
            <li>
              <b>Device Information</b>: We may collect information about the device you use to access the Service, including the hardware model, 
              operating system, and device identifiers.
            </li>
            <li>
              <b>Log Data</b>: Our servers may automatically record information created by your use of the Service, including IP address, 
              browser type, pages visited, and the date and time of your visits.
            </li>
          </ul>
          <h4>c. Cookies and Tracking Technologies</h4>
          <ul>
            <li>
              <b>Cookies and Tracking: </b>We may use cookies and similar tracking technologies to collect information about your interactions with the Service. 
              This helps us understand your preferences and improve your user experience. You can manage your cookie preferences through your browser settings.
            </li>
          </ul>
      
          <h3>2. How We Use Your Information</h3>
          <h4>We use the information we collect for various purposes, including:</h4>
          <ul>
            <li>
              <b>Providing and Improving the Service</b>: To operate and maintain the Service, process transactions, and enhance your user experience.
            </li>
            <li>
              <b>Communication</b>: To send you updates, security alerts, and administrative messages.
            </li>
            <li>
              <b>Personalization</b>: To personalize your experience by showing you content and advertisements that match your interests.
            </li>
            <li>
              <b>Analytics</b>: To analyze usage trends and measure the effectiveness of the Service.
            </li>
            <li>
              <b>Security</b>: To protect the security and integrity of the Service and prevent fraudulent activity.
            </li>
          </ul>
  
          <h3>3. How We Share Your Information</h3>
          <p>We do not share your personal information with third parties except in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of the transaction.</li>
            <li><strong>Consent:</strong> We may share your information with your consent or at your direction.</li>
          </ul>
          
  
          <h3>4. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
  
          <h3>5. Your Choices</h3>
          <p>You have several choices regarding your information:</p>
          <ul>
              <li><strong>Account Information:</strong> You can update your account information by logging into your account and making the necessary changes.</li>
              <li><strong>Marketing Communications:</strong> You can opt out of receiving promotional emails from us by following the unsubscribe instructions provided in those emails.</li>
              <li><strong>Cookies:</strong> You can manage your cookie preferences through your browser settings. Please note that disabling cookies may affect the functionality of the Service.</li>
          </ul>
          
          <h3>6. Children's Privacy</h3>
          <p>The Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information from our records.</p>
          
          <h3>7. International Data Transfers</h3>
          <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from those of your country. We take appropriate measures to ensure that your personal information remains protected in accordance with this Privacy Policy.</p>
          
          <h3>8. Your Data Protection Rights</h3>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
              <li><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> You have the right to request that we correct any inaccuracies in your personal information.</li>
              <li><strong>Deletion:</strong> You have the right to request that we delete your personal information.</li>
              <li><strong>Objection:</strong> You have the right to object to our processing of your personal information.</li>
              <li><strong>Restriction:</strong> You have the right to request that we restrict the processing of your personal information.</li>
              <li><strong>Portability:</strong> You have the right to request a copy of your personal information in a portable format.</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:privacy@photofox.com">privacy@photofox.com</a>. We will respond to your request in accordance with applicable data protection laws.</p>
          
          <h3>9. Changes to This Privacy Policy</h3>
          <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this Privacy Policy. If the changes are significant, we will provide a more prominent notice (such as adding a statement to our homepage or sending you an email notification). Your continued use of the Service following the posting of changes constitutes your acceptance of such changes.</p>
          
          <h3>10. Contact Us</h3>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p><br/>
          <br/>
          <p>Email: <a href="mailto:privacy@photofox.com">privacy@photofox.com</a></p><br/>
          <p>Address: PhotoFox, 123 Creative Lane, Imaginary City, IC 45678</p>
        </>
    )

    const about_us = (
        <>
          <h3>Service Background</h3>
          <p>PhotoFox was made by Alex and Nazar while they were studying at Kyiv Polytechnic Institute (KPI), Ukraine. It started as a course project and has since was developed into a full-fledged service.</p>
          
          <h3>Mission Statement</h3>
          <p>Our mission is to provide a safe, easy-to-use, and open-source service for sharing and discussing pictures without overwhelming users visually.</p>
          
          <h3>Core Values</h3>
          <ul>
              <li><strong>Transparency:</strong> We strive to be on good terms with our users, ensuring they know what we do, how we do it, and how their information is used.</li>
              <li><strong>User-Focused:</strong> Our priority is to create an intuitive and enjoyable experience for our users.</li>
              <li><strong>Open Source:</strong> We harness the power of open source to foster innovation and community engagement.</li>
          </ul>
          
          <h3>Services Offered</h3>
          <p>PhotoFox allows users to add pictures and communicate about them through comments. We aim to provide a straightforward and enjoyable experience for sharing visual content.</p>
          
          <h3>Team Information</h3>
          <p>Meet our dedicated team:</p>
          <ul>
              <li><strong>Alex (Forelyl):</strong> Alex handles mostly backend, deployment, CSS parts, and some web client tasks. You can check out his work on <a href="https://github.com/Forelyl">GitHub</a>.</li>
              <li><strong>Nazar (Naz2204):</strong> Nazar is responsible for the web client React development and collaborates with Alex on backend integration. You can check out his work on <a href="https://github.com/Naz2204">GitHub</a>.</li>
          </ul>
          
          <h3>Contact Information</h3>
          <p>If you have any questions or need support, please contact us at:</p>
          <p>Email: <a href="mailto:support@photofox.com">support@photofox.com</a><br/>
          Address: PhotoFox, 123 Creative Lane, Imaginary City, IC 45678</p>
        </>
    )
    
    switch (type) {
        case 'privacy':
            return (
                <>
                    <div id='top-of-users-pictures'>
                        <Link to='/'>
                            <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                        </Link>
                        {titlePage}
                    </div>
                    {privacy}
                </>
            );
        case 'terms':
            return (
                <>
                    <div id='top-of-users-pictures'>
                        <Link to='/'>
                            <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                        </Link>
                        {titlePage}
                    </div>
                    {terms}
                </>
            );
        default:
            return (
                <>
                    <div id='top-of-users-pictures'>
                        <Link to='/'>
                            <img src='/SignElements/back_arrow.svg' alt='return to home page'/>
                        </Link>
                        {titlePage}
                    </div>
                    {about_us}
                </>
            );
    }
    

}