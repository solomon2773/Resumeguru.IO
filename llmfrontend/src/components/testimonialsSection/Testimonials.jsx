import Image from 'next/image'
import clsx from 'clsx'

import { Container } from '../Container'
import { Expandable } from '../Expandable'
import avatarImage3 from '@/../../public/images/avatars/gerardC.jpeg'
import avatarImage4 from '@/../../public/images/avatars/avatar-4.png'
import avatarImage5 from '@/../../public/images/avatars/avatar-12.png'
import avatarImage7 from '@/../../public/images/avatars/avatar-6.png'
import avatarImage8 from '@/../../public/images/avatars/avatar-13.png'
import avatarImage9 from '@/../../public/images/avatars/avatar-9.png'
import avatarImage10 from '@/../../public/images/avatars/avatar-10.png'
import avatarImage11 from '@/../../public/images/avatars/avatar-11.png'



export function Testimonials() {

  const testimonials = [
    [
      {
        content:
            'I didn\'t spend much time in it but my first impression, I love the key word extractor feature. The program parses really good information and summarizes the job description. I love the interactive video chat. it feels like one is talking to an expert, and it is helpful for people that do not have the ability to meet up in person with a resume expert.',
        author: {
          name: 'Gerard C., 26',
          role: 'Graduate Student',
          image: avatarImage3,
          linkedIn: 'https://www.linkedin.com/in/gerard-chukwu-370319135/',
          imgAlt: 'Gerard C. Avatar',
        },
      },
      {
        content:
            'Tech jobs are competitive, but this platform made me stand out. The skill mapping was spot on, and I believe it made all the difference in snagging my current position at a top tech firm.',
        author: {
          name: ' Mia H., 28',
          role: 'Software Developer',
          image: avatarImage4,
            imgAlt: 'Avatar User Mia H.',

        },
      },
      {
        content:
            'The tailored summary and ATS compatibility features are a game-changer. I\'ve recommended this service to all my colleagues. A modern solution for a modern job market!',
        author: {
          name: 'Liam S., 35',
          role: 'HR Specialist',
          image: avatarImage9,
          imgAlt: 'Avatar User Liam S.',
        },
      },
    ],
    [
      {
        content:
            'Presentation is everything in my field. Not only did the AI enhance the content of my resume, but it also helped me highlight my skills in a way that\'s visually appealing. Got compliments during my interviews!',
        author: {
          name: 'Emma K., 27',
          role: 'Graphic Designer',
          image: avatarImage7,
            imgAlt: 'Avatar User Emma K.',

        },
      },
      {
        content:
            'Unlocking my potential was as simple as uploading my old resume. I appreciate the actionable feedback which helped me know where I could improve further. An investment that\'s truly worth it.',
        author: {
          name: 'Anne P., 21',
          role: 'Financial Analyst',
          image: avatarImage11,
            imgAlt: 'Avatar User Anne P.',
        },
      },
      {
        content:
            'I\'ve been in the industry for over a decade, but my resume looked dated. This AI-driven system brought it into the 21st century. I got a callback from a top events company within days!',
        author: {
          name: 'Olivia D., 26',
          role: 'Event Coordinator',
          image: avatarImage8,
            imgAlt: 'Avatar User Olivia D.',
        },
      },
    ],
    [
      {
        content:
            'Being in a digital space, I thought I knew all about optimization, but this platform took my resume to another level. The AI\'s suggestions were invaluable!',
        author: {
          name: 'Emily A., 29',
          role: 'Digital Marketer',
          image: avatarImage5,
            imgAlt: 'Avatar User Emily A.',
        },
      },
      {
        content:
            'The tailored feedback offered insights I\'d never considered. My scientific accomplishments now shine brightly on my CV, opening doors to leading biotech firms.',
        author: {
          name: 'Hannah J., 27',
          role: 'Biotechnologist',
          image: avatarImage10,
          imgAlt: 'Avatar User Hannah J.',
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
          Some kind words from early customers...
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
            <Expandable.Button>Read more testimonials</Expandable.Button>
          </>
        )}
      </Expandable>
    </section>
  )
}
