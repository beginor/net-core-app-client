import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';

/** Static about page. */
export function AboutPage() {
    useBreadcrumbs([{ label: '首页', url: '/' }, { label: '关于' }]);

    return (
        <div className="m-5 text-center">
            <h1 className="text-2xl font-bold">About React App</h1>
            <p className="mt-2 text-gray-500">ASP.NET Core + React + Ant Design 后台管理模板</p>
        </div>
    );
}

export default AboutPage;
