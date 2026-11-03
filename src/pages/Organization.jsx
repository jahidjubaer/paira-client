import { useEffect, useState } from 'react'
import { FaArrowDown, FaBuildingColumns, FaCalendarCheck, FaClockRotateLeft, FaLayerGroup, FaPeopleGroup, FaSitemap, FaUserTie } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import PersonCard from '../components/PersonCard.jsx'
import { isCurrent, pastTerms, termLabel } from '../utils/people.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CheckList from '../components/CheckList.jsx'
import { builtInOrganization, withCommitteeNames } from '../data/editablePages.js'
import usePageContent from '../utils/usePageContent.js'

const tileColors = ['bg-secondary/25', 'bg-primary/10', 'bg-accent/10', 'bg-base-200', 'bg-primary/10', 'bg-secondary/25']

const Organization = () => {
  const { t, pick, num } = useLanguage()
  const { advisory, bankRule, coreTeam, executivePosts, generalCouncil, incomeSources, meetings, subCommittees, transparency } = withCommitteeNames(
    usePageContent('organization', builtInOrganization),
  )
  // Real committee members from Dashboard → Committee & people; the page falls back to the constitution's posts
  const [people, setPeople] = useState([])

  useEffect(() => {
    api
      .get('/people')
      .then(({ data }) => setPeople(data.people))
      .catch(() => {})
  }, [])

  const now = people.filter((p) => isCurrent(p))
  const serving = (body, committee) => now.filter((p) => p.body === body && (!committee || p.committee === committee))
  const core = serving('core')
  const advisers = serving('advisory')
  const executive = serving('executive')
  // Past executive and advisory members, grouped by term
  const history = pastTerms(people.filter((p) => !isCurrent(p) && ['executive', 'advisory'].includes(p.body)), num)

  const tiers = [
    { icon: FaPeopleGroup, title: t('org.generalCouncil'), text: pick(generalCouncil) },
    { icon: FaUserTie, title: t('org.advisory'), text: `${pick(advisory.size)} · ${advisory.duties.map(pick).join(', ')}` },
    { icon: FaSitemap, title: t('org.executive'), text: `${num(executivePosts.length)} ${t('org.posts')}` },
    { icon: FaLayerGroup, title: t('org.subCommittees'), text: subCommittees.map((c) => pick(c.name)).join(' · ') },
  ]

  return (
    <>
      <PageHeader eyebrow={t('org.eyebrow')} title={t('nav.organization')} subtitle={t('org.subtitle')} />

      {/* Structure overview */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow={t('org.structure')} title={t('org.structureTitle')} />
        <div className="grid gap-4 lg:grid-cols-4">
          {tiers.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative rounded-[2rem] border border-base-300 p-6">
              <span className="font-display text-sm font-bold text-base-content/40">{num(String(i + 1).padStart(2, '0'))}</span>
              <Icon className="mt-4 size-8 text-primary" />
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">{text}</p>
              {i < tiers.length - 1 && <FaArrowDown className="mx-auto mt-4 size-4 text-base-content/30 lg:hidden" />}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[2rem] bg-base-200 p-6">
          <span className="mr-2 font-display text-lg font-bold">{t('org.coreTeam')}</span>
          {core.length > 0
            ? core.map((p) => (
                <span key={p._id} className="rounded-full bg-base-100 px-4 py-2 text-sm">
                  <span className="font-semibold">{pick(p.name)}</span>
                  {pick(p.post) && <span className="text-base-content/60"> · {pick(p.post)}</span>}
                </span>
              ))
            : coreTeam.map((c, i) => (
                <span key={i} className="rounded-full bg-base-100 px-4 py-2 text-sm font-medium">{pick(c)}</span>
              ))}
        </div>
      </section>

      {/* Advisory council */}
      <section className="px-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-neutral p-8 text-neutral-content sm:p-12">
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/40 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <SectionTitle eyebrow={t('org.advisory')} title={t('org.advisoryTitle')} light />
              <p className="text-sm text-neutral-content/60">{t('org.advisoryFrom')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {advisory.categories.map((c, i) => (
                  <span key={i} className="rounded-full border border-neutral-content/20 px-4 py-2 text-sm">{pick(c)}</span>
                ))}
              </div>
            </div>
            <div className="self-end rounded-[2rem] bg-neutral-content/5 p-6">
              <p className="font-display text-5xl font-bold text-secondary">{pick(advisory.size)}</p>
              <p className="mt-1 text-sm text-neutral-content/60">{t('org.advisorySize')}</p>
              <p className="mt-6 mb-3 font-semibold">{t('org.duties')}</p>
              <CheckList items={advisory.duties} light />
            </div>
          </div>
          {advisers.length > 0 && (
            <div className="relative mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {advisers.map((p) => <PersonCard key={p._id} person={p} light />)}
            </div>
          )}
        </div>
      </section>

      {/* Executive committee */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        {executive.length > 0 ? (
          <>
            <SectionTitle eyebrow={`${t('org.executive')} · ${termLabel(executive[0], num)}`} title={t('org.currentTitle')} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {executive.map((p, i) => <PersonCard key={p._id} person={p} highlight={i === 0} />)}
            </div>
          </>
        ) : (
          <>
            <SectionTitle eyebrow={t('org.executive')} title={t('org.executiveTitle')} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {executivePosts.map((p, i) => (
                <div key={i} className={`flex items-end justify-between gap-3 rounded-2xl p-5 ${i === 0 ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>
                  <p className="font-medium leading-snug">{pick(p.title)}</p>
                  <p className={`font-display text-3xl font-bold ${i === 0 ? 'text-secondary' : 'text-primary/40'}`}>{pick(p.count)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {history.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold"><FaClockRotateLeft className="text-accent" /> {t('org.pastCommittees')}</h3>
            <div className="space-y-3">
              {history.map(({ label, people: members }) => (
                <details key={label} className="collapse-arrow collapse rounded-2xl bg-base-200">
                  <summary className="collapse-title font-semibold">{label}</summary>
                  <ul className="collapse-content grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    {members.map((p) => (
                      <li key={p._id}>
                        <span className="font-medium">{pick(p.name)}</span>
                        {pick(p.post) && <span className="text-base-content/60"> · {pick(p.post)}</span>}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sub-committees */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow={t('org.subCommittees')} title={t('org.subTitle')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subCommittees.map((c, i) => (
              <div key={c.id} className="rounded-[2rem] bg-base-100 p-6 sm:p-8">
                <span className={`inline-block rounded-full px-3 py-1 font-display text-sm font-bold ${tileColors[i]}`}>{num(String(i + 1).padStart(2, '0'))}</span>
                <h3 className="mt-4 text-2xl font-bold">{pick(c.name)}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tasks.map((task, j) => (
                    <span key={j} className="rounded-full bg-base-200 px-3 py-1 text-sm">{pick(task)}</span>
                  ))}
                </div>
                {serving('subcommittee', c.id).length > 0 && (
                  <ul className="mt-5 space-y-1 border-t border-base-300 pt-4 text-sm">
                    {serving('subcommittee', c.id).map((p) => (
                      <li key={p._id}>
                        <span className="font-semibold">{pick(p.name)}</span>
                        {pick(p.post) && <span className="text-base-content/60"> · {pick(p.post)}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meetings + finance */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow={t('org.meetings')} title={t('org.meetingsTitle')} />
        <div className="grid gap-4 sm:grid-cols-3">
          {meetings.map((m, i) => (
            <div key={i} className="rounded-[2rem] border border-base-300 p-6">
              <FaCalendarCheck className="size-6 text-accent" />
              <p className="mt-6 font-display text-2xl font-bold">{pick(m.name)}</p>
              <p className="mt-1 text-base-content/70">{pick(m.when)}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <SectionTitle eyebrow={t('org.finance')} title={t('org.financeTitle')} />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[2rem] bg-secondary/20 p-8">
              <h3 className="text-xl font-bold">{t('org.incomeSources')}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {incomeSources.map((s, i) => (
                  <span key={i} className="rounded-full bg-base-100 px-4 py-2 text-sm font-medium">{pick(s)}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-primary p-8 text-primary-content">
              <FaBuildingColumns className="size-7 text-secondary" />
              <h3 className="mt-4 text-xl font-bold">{t('org.bankAccount')}</h3>
              <p className="mt-2 leading-relaxed text-primary-content/85">{pick(bankRule)}</p>
            </div>
            <div className="rounded-[2rem] bg-base-200 p-8">
              <h3 className="mb-5 text-xl font-bold">{t('org.transparency')}</h3>
              <CheckList items={transparency} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Organization
