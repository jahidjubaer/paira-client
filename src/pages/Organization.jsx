import { FaBuildingColumns, FaCalendarDays, FaCoins, FaPeopleGroup, FaUsers } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CheckList from '../components/CheckList.jsx'
import {
  advisory,
  bankRule,
  coreTeam,
  executivePosts,
  generalCouncil,
  incomeSources,
  meetings,
  subCommittees,
  transparency,
} from '../data/organization.js'

const Organization = () => {
  const { t, pick, num } = useLanguage()

  return (
    <>
      <PageHeader title={t('nav.organization')} subtitle={t('org.subtitle')} />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        {/* Core team + general council */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-200">
            <div className="card-body">
              <FaUsers className="size-7 text-primary" />
              <h2 className="card-title text-2xl">{t('org.coreTeam')}</h2>
              <CheckList items={coreTeam} />
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <FaPeopleGroup className="size-7 text-primary" />
              <h2 className="card-title text-2xl">{t('org.generalCouncil')}</h2>
              <p>{pick(generalCouncil)}</p>
            </div>
          </div>
        </section>

        {/* Advisory council */}
        <section>
          <SectionTitle title={t('org.advisory')} />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card border border-base-300 md:col-span-2">
              <div className="card-body">
                <p>
                  <span className="font-semibold">{t('org.advisorySize')}:</span> {pick(advisory.size)}
                </p>
                <p className="mt-2 font-semibold">{t('org.advisoryFrom')}:</p>
                <div className="flex flex-wrap gap-2">
                  {advisory.categories.map((c, i) => (
                    <span key={i} className="badge badge-primary badge-outline">{pick(c)}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h3 className="card-title">{t('org.duties')}</h3>
                <ul className="list-inside list-disc space-y-1">
                  {advisory.duties.map((d, i) => <li key={i}>{pick(d)}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Executive committee */}
        <section>
          <SectionTitle title={t('org.executive')} />
          <div className="overflow-x-auto rounded-box border border-base-300">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('org.post')}</th>
                  <th className="text-right">{t('org.count')}</th>
                </tr>
              </thead>
              <tbody>
                {executivePosts.map((p, i) => (
                  <tr key={i}>
                    <td>{num(i + 1)}</td>
                    <td>{pick(p.title)}</td>
                    <td className="text-right">{pick(p.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sub-committees */}
        <section>
          <SectionTitle title={t('org.subCommittees')} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subCommittees.map((c, i) => (
              <div key={i} className="card border-t-4 border-secondary bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">{pick(c.name)}</h3>
                  <div className="flex flex-wrap gap-2">
                    {c.tasks.map((task, j) => (
                      <span key={j} className="badge badge-ghost">{pick(task)}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meetings */}
        <section>
          <SectionTitle title={t('org.meetings')} />
          <div className="grid gap-4 sm:grid-cols-3">
            {meetings.map((m, i) => (
              <div key={i} className="flex items-center gap-4 rounded-box border border-base-300 p-5">
                <FaCalendarDays className="size-8 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{pick(m.name)}</p>
                  <p className="text-sm opacity-80">{pick(m.when)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Finance */}
        <section>
          <SectionTitle title={t('org.finance')} />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card bg-base-200">
              <div className="card-body">
                <FaCoins className="size-7 text-secondary" />
                <h3 className="card-title">{t('org.incomeSources')}</h3>
                <CheckList items={incomeSources} />
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <FaBuildingColumns className="size-7 text-secondary" />
                <h3 className="card-title">{t('org.bankAccount')}</h3>
                <p>{pick(bankRule)}</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <FaUsers className="size-7 text-secondary" />
                <h3 className="card-title">{t('org.transparency')}</h3>
                <CheckList items={transparency} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Organization
