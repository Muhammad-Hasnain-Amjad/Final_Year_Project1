import Derma from '../assets/Dermatologist.svg'
import Gastro from '../assets/Gastroenterologist.svg'
import GP from '../assets/General_physician.svg'
import Neuro from '../assets/Neurologist.svg'
import Pedri from '../assets/Pediatricians.svg'
import Gyni from '../assets/Gynecologist.svg'
import Bus_lawyer from '../assets/Business_lawyer.jpeg'
import civ_lawyer from '../assets/CivilLawyer.jpeg'
import crim_lawyer from '../assets/criminal_lawyer.jpeg'
import fam_lawyer from '../assets/familylawyer.jpeg'
import prop_lawyer from '../assets/PropertyLawyer.jpeg'
import tax_lawyer from '../assets/Tax_lawyer.jpeg'
import privatechat from '../assets/privatechat.png';
import trustedlawyers from '../assets/trustedlawyers.jpg';
import trusteddr from '../assets/trusteddr.png';
import rating from '../assets/rating.png';
import headphone from '../assets/headphone.png';
import booking from '../assets/booking.png';

export const services = [
  {
    title: 'Book Expert Doctors',
    desc: 'Schedule appointments with verified and experienced doctors across all specialties.',
    image: trusteddr,
  },
  {
    title: 'Trusted Lawyers',
    desc: 'Connect with professional lawyers for family, business, and legal matters.',
    image: trustedlawyers,
  },
  {
    title: 'Instant Booking',
    desc: 'See availability in real-time and book your consultation instantly.',
    image: booking,
  },
  {
    title: 'Verified Profiles & Reviews',
    desc: 'Check credentials and read real feedback from previous patients or clients.',
    image: rating,
  },
  {
    title: '24/7 Support',
    desc: 'Our support team is available round the clock to help you with bookings and queries.',
    image: headphone,
  },
  {
    title: 'Secure Consultations',
    desc: 'Private and secure communication with doctors and lawyers through our platform.',
    image: privatechat,
  },
];
export const DrData=[{
    sp:"Dermatologist",
    image:Derma,
},{
    sp:"Gastroenterologist",
    image:Gastro,
},
{
    sp:"General_physician",
    image:GP,
},
{
    sp:"Neurologist",
    image: Neuro,
},
{
    sp:"Pediatricians",
    image:Pedri,
},
{
    sp:"Gynecologist",
    image:Gyni,
}
]
export const LawyersData = [
  {
    sp: "Business Lawyer",
    image: Bus_lawyer,
  },
  {
    sp: "Civil Lawyer",
    image: civ_lawyer,
  },
  {
    sp: "Criminal Lawyer",
    image: crim_lawyer,
  },
  {
    sp: "Family Lawyer",
    image: fam_lawyer,
  },
  {
    sp: "Property Lawyer",
    image: prop_lawyer,
  },
  {
    sp: "Tax Lawyer",
    image: tax_lawyer,
  }
];