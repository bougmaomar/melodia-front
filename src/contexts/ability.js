import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function defineAbilitiesFor(accesses) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  accesses.forEach((section) => {
    if (section.role.name === 'admin') {
      can('create', section.section.label);
      can('read', section.section.label);
      can('update', section.section.label);
      can('delete', section.section.label);
    } else {
      if (section.insert) can('create', section.section.label);
      if (section.read) can('read', section.section.label);
      if (section.update) can('update', section.section.label);
      if (section.delete) can('delete', section.section.label);
    }
  });

  return build();
}
