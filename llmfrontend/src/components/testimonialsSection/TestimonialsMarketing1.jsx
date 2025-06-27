import Image from 'next/image'
import clsx from 'clsx'

import { Container } from '../Container'
import { Expandable } from '../Expandable'
import avatarImage4 from '@/../../public/images/avatars/avatar-4.png'
import avatarImage18 from '@/../../public/images/avatars/avatar-18.png'
import avatarImage15 from '@/../../public/images/avatars/avatar-15.png'
import avatarImage16 from '@/../../public/images/avatars/avatar-16.png'
import avatarImage14 from '@/../../public/images/avatars/avatar-14.png'
import avatarImage13 from '@/../../public/images/avatars/avatar-13.png'



export function TestimonialsMarketing1() {

  const testimonials = [
    [
      // {
      //   content:
      //       'I didn\'t spend much time in it but my first impression, I love the key word extractor feature. The program parses really good information and summarizes the job description. I love the interactive video chat. it feels like one is talking to an expert, and it is helpful for people that do not have the ability to meet up in person with a resume expert.',
      //   author: {
      //     name: 'Gerard C., 26',
      //     role: 'Graduate Student',
      //     image: avatarImage3,
      //     linkedIn: 'https://www.linkedin.com/in/gerard-chukwu-370319135/',
      //     imgAlt: 'Gerard C. Avatar',
      //   },
      // },
      {
        content:
            'ResumeGuru.io transformed my job search experience! The AI tools\n' +
            'helped me create a standout resume, and the mock interview feature was a\n' +
            'game-changer. I landed my dream job in just a few weeks!',
        author: {
          name: ' Sarah J. ',
          role: 'Marketing Manager',
          image: avatarImage4,
            imgAlt: 'Avatar User Sarah J.',

        },
      },
      {
        content:
            'The AI-powered resume builder was incredibly intuitive and effective. I\n' +
            'received multiple interviews calls within days of using it. Highly recommend!',
        author: {
          name: 'David L.',
          role: 'Software Engineer',
          image: avatarImage14,
          imgAlt: 'Avatar User David L.',
        },
      },

    ],
    [
      {
        content:
            'As a recent graduate, I struggled to create a resume that stood out.\n' +
            'ResumeGuru.io’s AI builder was a lifesaver. I quickly received responses from\n' +
            'several companies!',
        author: {
          name: 'Alex M.',
          role: 'Business Analyst',
          image: avatarImage15,
            imgAlt: 'Avatar User Alex M.',

        },
      },
      {
        content:
            'I was unsure how to highlight my college projects. ResumeGuru.io guided\n' +
            'me through every step, and I landed a role in a creative agency within a month.',
        author: {
          name: 'Maria P.',
          role: 'Graphic Designer',
          image: avatarImage13,
            imgAlt: 'Avatar User Maria P.',
        },
      },

    ],
    [
      {
        content:
            'The mock interview practice was invaluable. It helped me prepare for\n' +
            'real-life scenarios, and I nailed my first job interview!',
        author: {
          name: 'Liam T.',
          role: 'Digital Marketer',
          image: avatarImage18,
          imgAlt: 'Avatar User Liam T.',
        },
      },
      {
        content:
            'I was nervous about entering the job market, but ResumeGuru.io made it\n' +
            'so easy! The feedback from the AI mock interviews gave me the confidence I\n' +
            'needed.',
        author: {
          name: 'Emma R.',
          role: 'Recent Graduate',
          image: avatarImage16,
          imgAlt: 'Avatar User Emma R.',
        },
      },
    ],


  ]

  function Testimonial({ author, children }) {
    return (
        <figure className="rounded-4xl p-8 shadow-md ring-1 ring-slate-900/5">
          <blockquote>
            <p className="text-lg tracking-tight text-slate-900 before:content-['“'] after:content-['”']">
              {children}
            </p>
          </blockquote>
          <figcaption className="mt-6 flex items-center">
            <div className="overflow-hidden rounded-full bg-slate-50">
              {author.linkedIn ? (
                  <a href={author.linkedIn}>
                    <Image
                        className="h-12 w-12 object-cover"
                        src={author.image}
                        alt={author.imgAlt}
                        width={48}
                        height={48}
                    />
                  </a>
              ) :(
                  <Image
                      className="h-12 w-12 object-cover"
                      src={author.image}
                      alt={author.imgAlt}
                      width={48}
                      height={48}
                  />

              )}

            </div>
            <div className="ml-4">
              <div className="text-base font-medium leading-6 tracking-tight text-slate-900">
                {author.name}
              </div>
              <div className="mt-1 text-sm text-slate-600">{author.role}</div>
            </div>
          </figcaption>
        </figure>
    )
  }

  return (
    <section className="py-8 sm:py-10 lg:py-16">
      <Container className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900">
          What Our Users Say...
        </h2>
        {/*<p className="mt-4 text-lg tracking-tight text-slate-600">*/}
        {/*  I worked with a small group of early access customers to make sure all*/}
        {/*  of the content in the book was exactly what they needed. Hears what*/}
        {/*  they had to say about the finished product.*/}
        {/*</p>*/}
      </Container>
      <Expandable>
        {({ isExpanded }) => (
          <>
            <ul
              role="list"
              className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 px-4 lg:max-w-7xl lg:grid-cols-3 lg:px-8"
            >
              {testimonials
                .map((column) => column[0])
                .map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex} className="lg:hidden">
                    <Testimonial author={testimonial.author}>
                      {testimonial.content}
                    </Testimonial>
                  </li>
                ))}
              {testimonials.map((column, columnIndex) => (
                <li
                  key={columnIndex}
                  className={isExpanded ? undefined : 'hidden lg:list-item'}
                >
                  <ul role="list">
                    {column
                      .slice(0, isExpanded ? undefined : 2)
                      .map((testimonial, testimonialIndex) => (
                        <li
                          key={testimonialIndex}
                          className={clsx(
                            testimonialIndex === 0 && 'hidden lg:list-item',
                            testimonialIndex === 1 && 'lg:mt-8',
                            testimonialIndex > 1 && 'mt-8'
                          )}
                        >
                          <Testimonial author={testimonial.author}>
                            {testimonial.content}
                          </Testimonial>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
            {/*<Expandable.Button>Read more testimonials</Expandable.Button>*/}
          </>
        )}
      </Expandable>
    </section>
  )
}
