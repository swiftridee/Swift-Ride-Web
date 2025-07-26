import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Swift Ride | Vehicle Rental Service Agreement</title>
        <meta name="description" content="Read the terms and conditions for using Swift Ride vehicle rental services. Understand your rights and responsibilities when booking our transportation services." />
        <meta name="keywords" content="Swift Ride terms, vehicle rental terms, rental agreement, terms and conditions, Swift Ride policy" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last Updated: May 20, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
              <p>
                Welcome to Swift Ride. These Terms & Conditions ("Terms") govern your use of our website, mobile applications, and any other related services (collectively, the "Services"). By using our Services, you agree to comply with and be legally bound by these Terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Eligibility</h2>
              <p>You must be:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>At least 18 years old</li>
                <li>Possess a valid Pakistani CNIC</li>
                <li>Hold a valid Pakistani driver's license if booking with a self-drive option</li>
              </ul>
              <p>
                You also agree to provide accurate and updated information during account registration and throughout your usage of Swift Ride.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Account Registration & Security</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You must notify Swift Ride immediately of any unauthorized use of your account.</li>
                <li>You may not create an account using false identity or someone else's information.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Rental Terms</h2>
              
              <h3 className="text-lg font-semibold mb-3">4.1 Booking & Cancellation</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Bookings are subject to vehicle availability.</li>
                <li>Full refunds for cancellations made at least 48 hours before pickup.</li>
                <li>Cancellations within 48 hours may be charged up to 30% cancellation fee.</li>
                <li>No refunds for no-shows or same-day cancellations.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">4.2 Vehicle Pickup & Return</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Vehicles must be picked up and returned at the agreed location and time.</li>
                <li>Late returns beyond a 30-minute grace period will incur hourly or daily charges.</li>
                <li>ID, CNIC, and license verification required at pickup.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">4.3 Vehicle Use</h3>
              <p className="mb-3">Vehicles may be used only for lawful purposes within Pakistan.</p>
              <p className="mb-3">Use is strictly prohibited for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Racing, off-road travel</li>
                <li>Transport of illegal items</li>
                <li>Commercial use (unless explicitly allowed)</li>
              </ul>
              <p>Any violation may result in immediate termination of rental and forfeiture of deposits.</p>
              
              <h3 className="text-lg font-semibold mb-3">4.4 Damages</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>You are responsible for all damages caused during the rental period.</li>
                <li>Optional insurance may be purchased at booking for damage coverage.</li>
                <li>Swift Ride will assess all damages upon return and deduct charges from your deposit.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">4.5 Driver, Fuel, and Traffic Rules</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Self-drive and with-driver options are available.</li>
                <li>In self-drive, you are liable for:</li>
                <ul className="list-disc pl-6 mt-2">
                  <li>Traffic violations</li>
                  <li>Motorway tolls</li>
                  <li>Fuel expenses</li>
                  <li>Road safety compliance (as per Motor Vehicles Ordinance 1965)</li>
                </ul>
                <li>Fines or challans must be paid by the user; failure to do so may result in blacklisting.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Payment Terms</h2>
              
              <h3 className="text-lg font-semibold mb-3">5.1 Rates & Charges</h3>
              <p className="mb-3">Rental rates depend on:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Vehicle type (Car, Bus, Mini Bus, Coaster)</li>
                <li>Rental plan (12 Hr, 2 Day, 3 Day, 1 Week)</li>
                <li>Driver option (With / Without Driver)</li>
              </ul>
              <p className="mb-4">Full amount (including taxes and fees) is shown at checkout.</p>
              <p>Late return, damage, and cleaning fees may apply.</p>
              
              <h3 className="text-lg font-semibold mb-3">5.2 Payment Methods</h3>
              <p className="mb-3">Accepted methods:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Credit/debit cards</li>
                <li>Cash</li>
              </ul>
              <p>Payment must be made in advance at the time of booking.</p>
              
              <h3 className="text-lg font-semibold mb-3">5.3 Security Deposit</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>A refundable security deposit may be required.</li>
                <li>Deposits are released within 3–7 working days after vehicle return, subject to:</li>
                <ul className="list-disc pl-6 mt-2">
                  <li>No damage</li>
                  <li>Timely return</li>
                  <li>Clean condition</li>
                </ul>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Refund Policy</h2>
              
              <h3 className="text-lg font-semibold mb-3">6.1 Cancellation & Refund Terms</h3>
              <p className="mb-3">Swift Ride offers the following refund policy for bookings made through our platform:</p>
              
              <h4 className="text-md font-semibold mb-2">6.1.1 Full Refund (100%)</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cancellations made 48 hours or more before the scheduled pickup time</li>
                <li>Vehicle unavailability due to mechanical issues or maintenance</li>
                <li>Service cancellation by Swift Ride due to operational issues</li>
                <li>Force majeure events (natural disasters, government restrictions, etc.)</li>
              </ul>
              
              <h4 className="text-md font-semibold mb-2">6.1.2 Partial Refund (70%)</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cancellations made between 24-48 hours before the scheduled pickup time</li>
                <li>30% cancellation fee applies</li>
              </ul>
              
              <h4 className="text-md font-semibold mb-2">6.1.3 No Refund (0%)</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cancellations made less than 24 hours before pickup time</li>
                <li>No-show at the scheduled pickup time and location</li>
                <li>Same-day cancellations</li>
                <li>Violation of rental terms leading to service termination</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">6.2 Refund Processing</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Refunds are processed within 5-7 working days for card payments</li>
                <li>Cash refunds are processed at our Faisalabad office within 3 working days</li>
                <li>Refunds are issued to the original payment method used for booking</li>
                <li>Bank processing times may vary (typically 3-5 additional business days)</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">6.3 Security Deposit Refunds</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Security deposits are refunded within 3-7 working days after vehicle return</li>
                <li>Deductions may apply for:</li>
                <ul className="list-disc pl-6 mt-2">
                  <li>Vehicle damage beyond normal wear and tear</li>
                  <li>Traffic violation fines incurred during rental period</li>
                  <li>Fuel costs if vehicle is returned with less fuel than at pickup</li>
                  <li>Cleaning fees for excessive dirt or damage to interior</li>
                  <li>Late return fees beyond the 30-minute grace period</li>
                </ul>
                <li>Detailed breakdown of any deductions will be provided via email</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">6.4 Refund Exceptions</h3>
              <p className="mb-3">No refunds will be provided for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Services already rendered or partially used</li>
                <li>Customer dissatisfaction with vehicle features or performance (unless vehicle is defective)</li>
                <li>Weather-related cancellations unless Swift Ride determines conditions are unsafe</li>
                <li>Personal emergencies or change of plans (except as covered in 6.1.1)</li>
                <li>Failure to provide required documentation (CNIC, driver's license) at pickup</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">6.5 Refund Contact Information</h3>
              <p className="mb-3">For refund inquiries or disputes, contact us:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Email: <a href="mailto:contactswiftride@gmail.com" className="text-primary hover:underline">contactswiftride@gmail.com</a></li>
                <li>Phone: <a href="tel:0342-6988007" className="text-primary hover:underline">0342-6988007</a> | <a href="tel:0309-7288942" className="text-primary hover:underline">0309-7288942</a></li>
                <li>Office Hours: Monday to Saturday, 9:00 AM to 6:00 PM (Pakistan Standard Time)</li>
                <li>Address: Sargodha Road, Near Crescent Textile Mills, Faisalabad</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">6.6 Dispute Resolution</h3>
              <p className="mb-3">In case of refund disputes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Swift Ride will investigate all refund requests within 48 hours</li>
                <li>Evidence and documentation may be required for dispute resolution</li>
                <li>Final decisions are made by Swift Ride management</li>
                <li>Customers may escalate to relevant consumer protection authorities in Pakistan if unsatisfied</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Limitation of Liability</h2>
              <p>Swift Ride is not liable for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Accidents, delays, or breakdowns during your rental</li>
                <li>Personal loss or injury due to misuse of the vehicle</li>
              </ul>
              <p>Our total liability is limited to the amount paid for the booking.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Indemnity</h2>
              <p>
                You agree to indemnify and hold harmless Swift Ride, its officers, employees, and agents from any claims, damages, fines, or costs resulting from your misuse of the Services or breach of these Terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Modifications to the Terms</h2>
              <p>
                Swift Ride may update these Terms & Conditions at any time. Notice will be provided on the website or by email. Continued use of the Services after updates constitutes agreement.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">10. Governing Law</h2>
              <p>These Terms & Conditions are governed by and construed in accordance with the laws of Pakistan, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Motor Vehicles Ordinance 1965</li>
                <li>Consumer Protection Act</li>
                <li>Local vehicle rental and safety regulations</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4">11. Contact Information</h2>
              <p>For queries or complaints regarding these Terms, contact us:</p>
              <address className="not-italic">
                <div className="mb-2">
                  <span className="font-semibold">Swift Ride</span>
                </div>
                <div className="mb-2">Sargodha Road, Near Crescent Textile Mills, Faisalabad</div>
                <div className="mb-2">
                  Email: <a href="mailto:contactswiftride@gmail.com" className="text-primary hover:underline">contactswiftride@gmail.com</a>
                </div>
                <div>
                  Phone: <a href="tel:0342-6988007" className="text-primary hover:underline">0342-6988007</a> | <a href="tel:0309-7288942" className="text-primary hover:underline">0309-7288942</a>
                </div>
              </address>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms;
